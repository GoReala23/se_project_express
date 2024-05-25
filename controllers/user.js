const validator = require("validator");
const User = require("../models/user");
const ERROR_CODES = require("../utils/errors");

// Controller function to return all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    if (error.name === "CastError") {
      res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ message: "An error occured while fetching users " });
    } else {
      res.status(ERROR_CODES.SERVER_ERROR).send({
        message: "An error occured while fetching users",
      });
    }
  }
};

// Controller function to return a user by ID
const getUser = async (req, res) => {
  try {
    const thisUser = await User.findById(req.params.id);
    if (!thisUser) {
      return res.status(ERROR_CODES.RESOURCE_NOT_FOUND_ERROR).send({
        message: "User not found",
      });
    }
    return res.status(200).json(thisUser);
  } catch (err) {
    if (err.name === "CastError") {
      return res
        .status(ERROR_CODES.INVALID_ID_ERROR)
        .send({ message: "Invalid user ID format" });
    }
    return res.status(ERROR_CODES.SERVER_ERROR).send({ message: err.message });
  }
};
// Controller function to create a new user
// Create a new user
const createUser = async (req, res) => {
  const { name, avatar } = req.body;

  try {
    const newUser = new User({ name, avatar });
    const savedUser = await newUser.save();
    return res.status(201).json(savedUser);
  } catch (err) {
    if (!name || !avatar) {
      return res
        .status(ERROR_CODES.INVALID_DATA)
        .json({ message: "You must include all required fields" });
    }

    if (name.length < 2) {
      return res
        .status(ERROR_CODES.INVALID_DATA)
        .json({ message: "Name must be at least 2 characters long" });
    }

    if (name.length > 30) {
      return res.status(ERROR_CODES.INVALID_DATA).json({
        message: "Name must be less than or equal to 30 characters long",
      });
    }

    if (!validator.isURL(avatar)) {
      return res
        .status(ERROR_CODES.INVALID_DATA)
        .json({ message: "You must enter a valid URL" });
    }
    console.error(err);
    return res
      .status(ERROR_CODES.SERVER_ERROR)
      .json({ message: "An error occurred while creating the user" });
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
};
