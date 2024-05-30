const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const User = require("../models/user");

const getUser = async (req, res, next) => {
    let users;
    try {
        users = await User.find({}, "-password"); // Excluding password. Just getting name and email values
    } catch (error) {
        return next(new HttpError("Fetching users failed, please try again later.", 500));
    }
    res.json({ users: users.map(user => user.toObject({ getters: true })) });
};

const signUp = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError("Invalid input, please check your data.", 422));
    }

    const { name, email, password } = req.body;
    let userExist;
    try {
        userExist = await User.findOne({ email: email });
    } catch (error) {
        return next(new HttpError("Signing up failed, please try again later.", 500));
    }

    if (userExist) {
        return next(new HttpError("User exists already, please login instead.", 422));
    }

    const createdUser = new User({
        name,
        email,
        image: req.file.path,
        password,
        places: []
    });

    try {
        await createdUser.save();
    } catch (error) {
        return next(new HttpError("Creating user failed, please try again.", 500));
    }

    res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const logIn = async (req, res, next) => {
    const { email, password } = req.body;
    let userExist;
    try {
        userExist = await User.findOne({ email: email });
    } catch (error) {
        return next(new HttpError("Logging in failed, please try again later.", 500));
    }

    if (!userExist || userExist.password !== password) {
        return next(new HttpError("Invalid credentials, could not log you in.", 401));
    }

    res.json({ message: "Logged in successfully.", user: userExist.toObject({ getters: true }) });
};

module.exports = { getUser, signUp, logIn };
