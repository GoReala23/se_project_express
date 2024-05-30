const validator = require("validator");
const User = require("../models/user");
const ERROR_CODES = require("../utils/errors");

// Controller function to return all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(ERROR_CODES.SERVER_ERROR).send({
      message: "An error occurred while fetching users",
    });
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
    console.error(err);
    return res
      .status(ERROR_CODES.SERVER_ERROR)
      .send({ message: "Error while getting user" });
  }
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  // Check if the name field is missing
  if (!name) {
    return res
      .status(ERROR_CODES.USER_CREATION_ERROR)
      .send({ message: "Name is required" });
  }

  // Check if the name length is less than 2 or greater than 30 characters
  if (name.length < 2 || name.length > 30) {
    return res
      .status(ERROR_CODES.USER_CREATION_ERROR)
      .send({ message: "Name must be between 2 and 30 characters long" });
  }

  // Check if the avatar field is missing
  if (!avatar) {
    return res
      .status(ERROR_CODES.USER_CREATION_ERROR)
      .send({ message: "Avatar is required" });
  }

  // Check if the avatar is a valid URL
  if (!validator.isURL(avatar)) {
    return res
      .status(ERROR_CODES.USER_CREATION_ERROR)
      .send({ message: "You must enter a valid URL" });
  }

  // Create the new user
  const newUser = new User({ name, avatar });
  newUser
    .save()
    .then((savedUser) => res.status(201).send(savedUser))
    .catch((err) =>
      res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ message: "An error occurred while creating the user", err })
    );

  return newUser;
};

module.exports = {
  getUsers,
  getUser,
  createUser,
};
