const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

const BadRequestError = require("../errors/BadRequestError");
const ConflictError = require("../errors/ConflictError");
const UnauthorizedError = require("../errors/UnauthorizedError");
const NotFoundError = require("../errors/NotFoundError");
const ServerError = require("../errors/ServerError");

// Controller function to create a new user
const createUser = async (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  try {
    // Check if a user with the provided email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ConflictError("User already exists"));
    }

    // Hash the password
    const hash = await bcrypt.hash(password, 10);

    // Create the new user
    const user = await User.create({ name, avatar, email, password: hash });

    return res.status(201).send({
      name: user.name,
      avatar: user.avatar,
      email: user.email,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      return next(new BadRequestError("Validation error"));
    }

    return next(new ServerError("An error occurred while creating the user"));
  }
};

// Controller function for user login
const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("Both email and password are required"));
  }

  if (!validator.isEmail(email)) {
    return next(new BadRequestError("Invalid email format"));
  }

  try {
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    return res.send({
      token,
    });
  } catch (err) {
    if (err.message === "Incorrect email or password") {
      return next(new UnauthorizedError("Incorrect email or password"));
    }
    return next(new ServerError("Authentication failed"));
  }
};

// Controller function to get the current logged-in user
const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password"); // Exclude password
    if (!user) {
      return next(new NotFoundError("User not found"));
    }

    return res.status(200).send(user);
  } catch (err) {
    return next(err);
  }
};

// Controller function to update user data
const updateUser = async (req, res, next) => {
  const { name, avatar } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, avatar },
      { new: true, runValidators: true }
    );
    if (!user) {
      return next(new NotFoundError("User not found"));
    }

    return res.status(200).send(user);
  } catch (err) {
    if (err.name === "ValidationError") {
      return next(new BadRequestError("Validation error"));
    }
    return next(err);
  }
};

module.exports = {
  getCurrentUser,
  updateUser,
  createUser,
  login,
};
