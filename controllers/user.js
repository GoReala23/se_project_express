const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const User = require("../models/user");
const ERROR_CODES = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

// Controller function to create a new user
// Controller function to create a new user
const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  // Check if the email already exists
  return User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        return res.status(ERROR_CODES.DUPLICATE_EMAIL_ERROR).send({
          message: "User with this email already exists",
        });
      }

      // Hash the password and create the user
      return bcrypt
        .hash(password, 10)
        .then((hash) => User.create({ name, avatar, email, password: hash }))
        .then((user) =>
          res.status(201).send({
            name: user.name,
            avatar: user.avatar,
            email: user.email,
          })
        );
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(ERROR_CODES.BAD_REQUEST).send({
          message: "Validation error",
        });
      }
      return res.status(ERROR_CODES.SERVER_ERROR).send({
        message: "An error occurred while creating the user",
      });
    });
};

// Controller function for user login
const login = (req, res) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    return res.status(ERROR_CODES.BAD_REQUEST).send({
      message: "Both email and password are required",
    });
  }

  // Validate email format
  if (!validator.isEmail(email)) {
    return res.status(ERROR_CODES.BAD_REQUEST).send({
      message: "Invalid email format",
    });
  }

  // Authenticate user
  return User.findUserByCredentials(email, password)
    .then((user) => {
      // Generate and send JWT token
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Incorrect email or password") {
        return res
          .status(ERROR_CODES.UNAUTHORIZED)
          .send({ message: "Incorrect email or password" });
      }
      return res.status(ERROR_CODES.SERVER_ERROR).send({
        message: "Authentication failed",
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
    .catch(() => {
      res.status(ERROR_CODES.SERVER_ERROR).send({
        message: "An error occurred while fetching user data",
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
        return res.status(ERROR_CODES.BAD_REQUEST).send({
          message: "Validation error",
        });
      }
      return res.status(ERROR_CODES.SERVER_ERROR).send({
        message: "An error occurred while updating user data",
      });
    });
};

module.exports = {
  getCurrentUser,
  updateUser,
  createUser,
  login,
};
