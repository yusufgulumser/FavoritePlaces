const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const Place = require("../models/place");
const User = require("../models/user");
const mongoose = require("mongoose");

const getPlaceById = async (req, res, next) => {
    const placeID = req.params.pid;
    let place;
    try {
        place = await Place.findById(placeID);
    } catch (error) {
        const err = new HttpError("Fetching place failed, please try again later.", 500);
        return next(err);
    }

    if (!place) {
        const error = new HttpError("Could not find a place for the provided ID.", 404);
        return next(error);
    }
    res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
    const userId = req.params.uid;
    let places;
    try {
        places = await Place.find({ creator: userId });
    } catch (error) {
        const err = new HttpError("Fetching places failed, please try again later.", 500);
        return next(err);
    }

    if (!places || places.length === 0) {
        return next(new HttpError("Could not find places for the provided user ID.", 404));
    }
    res.json({ places: places.map(place => place.toObject({ getters: true })) });
};

const createPlace = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError("Invalid input passed, please check your data.", 422));
    }
    const { title, description, creator } = req.body;

    const createdPlace = new Place({
        title,
        description,
        image: req.file.path,
        creator
    });

    let user;
    try {
        user = await User.findById(creator);
    } catch (error) {
        const err = new HttpError("Creating place failed, please try again.", 500);
        return next(err);
    }

    if (!user) {
        const err = new HttpError("Could not find user for the provided ID.", 404);
        return next(err);
    }

    try {
        const ses = await mongoose.startSession();
        ses.startTransaction();
        await createdPlace.save({ session: ses });
        user.places.push(createdPlace);
        await user.save({ session: ses });
        await ses.commitTransaction();
    } catch (error) {
        const err = new HttpError("Creating place failed, please try again.", 500);
        return next(err);
    }

    res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError("Invalid input passed, please check your data.", 422));
    }

    const { title, description } = req.body;
    const placeId = req.params.pid;
    let place;
    try {
        place = await Place.findById(placeId);
    } catch (error) {
        const err = new HttpError("Something went wrong, could not update place.", 500);
        return next(err);
    }

    if (!place) {
        const err = new HttpError("Could not find a place for the provided ID.", 404);
        return next(err);
    }

    place.title = title;
    place.description = description;
    try {
        await place.save();
    } catch (error) {
        const err = new HttpError("Something went wrong, could not update place.", 500);
        return next(err);
    }

    res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
    const placeId = req.params.pid;
    let place;
    try {
        place = await Place.findById(placeId).populate("creator");
    } catch (error) {
        const err = new HttpError("Something went wrong, could not delete place.", 500);
        return next(err);
    }

    if (!place) {
        const err = new HttpError("Could not find a place for the provided ID.", 404);
        return next(err);
    }

    try {
        const ses = await mongoose.startSession();
        ses.startTransaction();
        await place.deleteOne({ session: ses });
        place.creator.places.pull(place);
        await place.creator.save({ session: ses });
        await ses.commitTransaction();
    } catch (error) {
        const err = new HttpError("Something went wrong, could not delete place.", 500);
        return next(err);
    }
    res.status(200).json({ message: "Deleted place." });
};

module.exports = { getPlaceById, getPlacesByUserId, createPlace, updatePlace, deletePlace };