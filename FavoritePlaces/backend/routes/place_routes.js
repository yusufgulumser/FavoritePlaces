const express=require("express");
const {check}=require("express-validator");

const router=express.Router();
const HttpError = require("../models/http-error")
const placeController=require("../contoller/place-controller");
const fileUpload = require("../middleware/file-upload");


router.get("/:pid",placeController.getPlaceById);

router.get("/users/:uid",placeController.getPlacesByUserId)

router.post("/",
    fileUpload.single("image"),
[
    check("title").not().isEmpty(),
    check("description").isLength({min:5}),
],placeController.createPlace)

router.patch("/:pid",[
    check("title").not().isEmpty(),
    check("description").isLength({min:5}),
],placeController.updatePlace)

router.delete("/:pid",placeController.deletePlace)

module.exports= router;