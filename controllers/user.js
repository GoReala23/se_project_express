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

  // Create the new user
  return User.create({ name, avatar })
    .then((savedUser) => res.status(201).send(savedUser))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(ERROR_CODES.USER_CREATION_ERROR).send({
          message: "Validation error",
        });
      }
      console.error(err);
      return res.status(ERROR_CODES.SERVER_ERROR).send({
        message: "An error occurred while creating the user",
        err,
      });
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
};
