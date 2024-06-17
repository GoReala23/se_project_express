const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const User = require("../models/user");
const ERROR_CODES = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

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
        .send({ message: "Invalid user ID FORMAT" });
    }
    console.error(err);
    return res
      .status(ERROR_CODES.SERVER_ERROR)
      .send({ message: "Error while getting user" });
  }
};

// Controller function to create a new user
const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  // Validate required fields
  if (!name || !avatar || !email || !password) {
    return res.status(ERROR_CODES.INVALID_DATA_ERROR).send({
      message: "All fields (name, avatar, email, password) are required",
    });
  }

  // Validate name length
  if (name.length < 2 || name.length > 30) {
    return res.status(ERROR_CODES.INVALID_DATA_ERROR).send({
      message: "Name must be between 2 and 30 characters",
    });
  }

  // Validate email format
  if (!validator.isEmail(email)) {
    return res.status(ERROR_CODES.INVALID_DATA_ERROR).send({
      message: "Invalid email format",
    });
  }

  // Validate avatar URL format
  if (!validator.isURL(avatar)) {
    return res.status(ERROR_CODES.INVALID_DATA_ERROR).send({
      message: "Invalid avatar URL format",
    });
  }

  // Check if the email already exists
  return User.findOne({ email })
    .then((existingEmail) => {
      if (existingEmail) {
        return res
          .status(ERROR_CODES.DUPLICATE_EMAIL_ERROR)
          .send({ message: "User with this email already exists" });
      }

      // Hash the password and create the user
      return bcrypt
        .hash(password, 10)
        .then((hash) => User.create({ name, avatar, email, password: hash }))
        .then((user) =>
          res
            .status(201)
            .send({ name: user.name, avatar: user.avatar, email: user.email })
        );
    })
    .catch((err) => {
      if (err.code === 11000) {
        // Handle duplicate email error
        return res
          .status(409)
          .send({ message: "User with this email already exists" });
      }
      return next(err);
    });
};

// Controller function for user login
const login = (req, res) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    return res.status(ERROR_CODES.INVALID_DATA_ERROR).send({
      message: "Both email and password are required",
    });
  }

  // Validate email format
  if (!validator.isEmail(email)) {
    return res.status(ERROR_CODES.INVALID_DATA_ERROR).send({
      message: "Invalid email format",
    });
  }

  // Authenticate user
  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        return res.status(401).send({ message: "Incorrect email or password" });
      }

      // Generate and send JWT token
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      res.status(ERROR_CODES.UNAUTHORIZED).send({
        message: "Authentication failed",
        error: err.message,
      });
    });
};

// Controller function to get the current logged-in user
const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return res.status(ERROR_CODES.RESOURCE_NOT_FOUND_ERROR).send({
          message: "User not found",
        });
      }
      const { password, ...userData } = user.toObject();
      return res.status(200).send(userData);
    })
    .catch((err) => {
      res.status(ERROR_CODES.SERVER_ERROR).send({
        message: "An error occurred while fetching user data",
        err,
      });
    });
};

// Controller function to update user data
const updateUser = (req, res) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        return res.status(ERROR_CODES.RESOURCE_NOT_FOUND_ERROR).send({
          message: "User not found",
        });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(ERROR_CODES.INVALID_DATA_ERROR).send({
          message: "Validation error",
          err,
        });
      }
      return res.status(ERROR_CODES.SERVER_ERROR).send({
        message: "An error occurred while updating user data",
        err,
      });
    });
};

module.exports = {
  getUsers,
  getUser,
  getCurrentUser,
  updateUser,
  createUser,
  login,
};
