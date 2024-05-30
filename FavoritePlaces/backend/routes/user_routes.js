const express=require("express");
const {check}=require("express-validator");

const router=express.Router();
const HttpError = require("../models/http-error")
const userController=require("../contoller/user-controller");
const fileUpload = require("../middleware/file-upload");


router.get("/",userController.getUser);

router.post("/signup",
    fileUpload.single("image"),
[
    check("name").not().isEmpty(),
    check("password").isLength({min:6}),
    check("email").normalizeEmail().isEmail()
],userController.signUp)


router.post("/login",userController.logIn)

module.exports= router;