const express= require("express");
const path=require("path");
const bodyParser= require("body-parser");
const mongoose=require("mongoose");
const placeRoutes=require("./routes/place_routes");
const userRoutes=require("./routes/user_routes");
const HttpError = require("./models/http-error");
const fs=require("fs");

const app=express();

app.use(bodyParser.json());  //When a request is received with a Content-Type of application/json, body-parser will parse the JSON and make it available under req.body.

app.use("/uploads/images",express.static(path.join("uploads","images")));

app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept,Authorization");
    res.setHeader("Access-Control-Allow-Methods","GET,POST,PATCH,DELETE");
    next();

});

app.use("/api/places",placeRoutes);
app.use("/api/users",userRoutes);

app.use((req,res,next)=>{
    throw new HttpError("Couldnt find this route",404);
})

app.use((error,req,res,next)=>{
    if(req.file){
        fs.unlink(req.file.path,err=>{
            console.log(err);
        });
    }
    if(res.headerSent){
        return next(error);
    }
    res.status(error.code || 500);
    res.json({message:error.message||"an error occured"});
})

mongoose.connect("mongodb+srv://gulumseryusuf:test123@cluster0.xvqbh9g.mongodb.net/finalProject?retryWrites=true&w=majority&appName=Cluster0")
.then(()=>{
    app.listen(5000);
}).catch((error=>{
    console.log(error);
}))