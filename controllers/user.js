const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const User = require("../models/user");
const ERROR_CODES = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

// Controller function to create a new user
const createUser = async (req, res) => {
  const { name, avatar, email, password } = req.body;

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(ERROR_CODES.DUPLICATE_EMAIL_ERROR).send({
        message: "User with this email already exists",
      });
    }

    // Hash the password and create the user
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, avatar, email, password: hash });

    return res.status(201).send({
      name: user.name,
      avatar: user.avatar,
      email: user.email,
    });
  } catch (err) {
    console.error("Error creating user:", err);
    if (err.name === "ValidationError") {
      return res.status(ERROR_CODES.BAD_REQUEST).send({
        message: "Validation error",
      });
    }
    return res.status(ERROR_CODES.SERVER_ERROR).send({
      message: "An error occurred while creating the user",
    });
  }
};

// Controller function for user login
const login = async (req, res) => {
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

  try {
    // Authenticate user
    const user = await User.findUserByCredentials(email, password);

    // Generate and send JWT token
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    return res.send({ token });
  } catch (err) {
    console.error("Login error:", err);
    if (err.message === "Incorrect email or password") {
      return res
        .status(ERROR_CODES.UNAUTHORIZED)
        .send({ message: "Incorrect email or password" });
    }
    return res.status(ERROR_CODES.SERVER_ERROR).send({
      message: "Authentication failed",
    });
  }
};

// Controller function to get the current logged-in user
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(ERROR_CODES.RESOURCE_NOT_FOUND_ERROR).send({
        message: "User not found",
      });
    }

    const { password, ...userData } = user.toObject();
    return res.status(200).send(userData);
  } catch (err) {
    console.error("Error fetching user data:", err);
    return res.status(ERROR_CODES.SERVER_ERROR).send({
      message: "An error occurred while fetching user data",
    });
  }
};

// Controller function to update user data
const updateUser = async (req, res) => {
  const { name, avatar } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, avatar },
      { new: true, runValidators: true }
    );
    if (!user) {
      return res.status(ERROR_CODES.RESOURCE_NOT_FOUND_ERROR).send({
        message: "User not found",
      });
    }

    return res.status(200).send(user);
  } catch (err) {
    console.error("Error updating user data:", err);
    if (err.name === "ValidationError") {
      return res.status(ERROR_CODES.BAD_REQUEST).send({
        message: "Validation error",
      });
    }
    return res.status(ERROR_CODES.SERVER_ERROR).send({
      message: "An error occurred while updating user data",
    });
  }
};

module.exports = {
  getCurrentUser,
  updateUser,
  createUser,
  login,
};
