// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");
// const validator = require("validator");
// const User = require("../models/user");
// const ERROR_CODES = require("../utils/errors");
// const { JWT_SECRET } = require("../utils/config");

// // Controller function to create a new user
// const createUser = async (req, res) => {
//   const { name, avatar, email, password } = req.body;

//   try {
//     // Check if the email already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(ERROR_CODES.DUPLICATE_EMAIL_ERROR).send({
//         message: "User with this email already exists",
//       });
//     }

//     // Hash the password and create the user
//     const hash = await bcrypt.hash(password, 10);
//     const user = await User.create({ name, avatar, email, password: hash });

//     return res.status(201).send({
//       name: user.name,
//       avatar: user.avatar,
//       email: user.email,
//     });
//   } catch (err) {
//     console.error("Error creating user:", err);
//     if (err.name === "ValidationError") {
//       return res.status(ERROR_CODES.BAD_REQUEST).send({
//         message: "Validation error",
//       });
//     }
//     return res.status(ERROR_CODES.SERVER_ERROR).send({
//       message: "An error occurred while creating the user",
//     });
//   }
// };

// // Controller function for user login
// const login = async (req, res) => {
//   const { email, password } = req.body;

//   // Validate required fields
//   if (!email || !password) {
//     return res.status(ERROR_CODES.BAD_REQUEST).send({
//       message: "Both email and password are required",
//     });
//   }

//   // Validate email format
//   if (!validator.isEmail(email)) {
//     return res.status(ERROR_CODES.BAD_REQUEST).send({
//       message: "Invalid email format",
//     });
//   }

//   try {
//     // Authenticate user
//     const user = await User.findUserByCredentials(email, password);

//     // Generate and send JWT token
//     const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });

//     return res.send({ token, user });
//   } catch (err) {
//     console.error("Login error:", err);
//     if (err.message === "Incorrect email or password") {
//       return res
//         .status(ERROR_CODES.UNAUTHORIZED)
//         .send({ message: "Incorrect email or password" });
//     }
//     return res.status(ERROR_CODES.SERVER_ERROR).send({
//       message: "Authentication failed",
//     });
//   }
// };

// // Controller function to get the current logged-in user
// const getCurrentUser = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id);
//     if (!user) {
//       return res.status(ERROR_CODES.RESOURCE_NOT_FOUND_ERROR).send({
//         message: "User not found",
//       });
//     }

//     const { password, ...userData } = user.toObject();
//     return res.status(200).send(userData);
//   } catch (err) {
//     console.error("Error fetching user data:", err);
//     return res.status(ERROR_CODES.SERVER_ERROR).send({
//       message: "An error occurred while fetching user data",
//     });
//   }
// };

// // Controller function to update user data
// const updateUser = async (req, res) => {
//   const { name, avatar } = req.body;

//   try {
//     const user = await User.findByIdAndUpdate(
//       req.user._id,
//       { name, avatar },
//       { new: true, runValidators: true }
//     );
//     if (!user) {
//       return res.status(ERROR_CODES.RESOURCE_NOT_FOUND_ERROR).send({
//         message: "User not found",
//       });
//     }

//     return res.status(200).send(user);
//   } catch (err) {
//     console.error("Error updating user data:", err);
//     if (err.name === "ValidationError") {
//       return res.status(ERROR_CODES.BAD_REQUEST).send({
//         message: "Validation error",
//       });
//     }
//     return res.status(ERROR_CODES.SERVER_ERROR).send({
//       message: "An error occurred while updating user data",
//     });
//   }
// };

// module.exports = {
//   getCurrentUser,
//   updateUser,
//   createUser,
//   login,
// };

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
  console.log("Received user data:", { name, avatar, email, password });
  try {
    console.log("Received user data:", { name, avatar, email, password });

    // Check if a user with the provided email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ConflictError("User with this email already exists");
    }

    // Hash the password
    const hash = await bcrypt.hash(password, 10);

    // Create the new user
    const user = await User.create({ name, avatar, email, password: hash });

    console.log("User created successfully:", user);

    return res.status(201).send({
      name: user.name,
      avatar: user.avatar,
      email: user.email,
    });
  } catch (err) {
    console.error("Error creating user:", err); // Log the full error object

    // Handle validation errors from Mongoose
    if (err.name === "ValidationError") {
      return res.status(400).send({
        message: "Validation error",
        details: Object.values(err.errors).map((error) => ({
          message: error.message,
          path: error.path,
        })),
      });
    }

    // Handle any other errors
    return res.status(500).json({
      message: "An error occurred while creating the user",
      error: err.message, // Send the error message back to the client
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }), // Send stack trace only in development mode
    });
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

    return res.send({ token, user });
  } catch (err) {
    if (err.message === "Incorrect email or password") {
      next(new UnauthorizedError("Incorrect email or password"));
    } else {
      next(new ServerError("Authentication failed"));
    }
  }

  // Explicit return to satisfy ESLint
  return null;
};

// Controller function to get the current logged-in user
const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password"); // Exclude password
    if (!user) {
      throw new NotFoundError("User not found");
    }

    return res.status(200).send(user);
  } catch (err) {
    next(new ServerError("An error occurred while fetching user data"));
  }

  return null;
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
      throw new NotFoundError("User not found");
    }

    return res.status(200).send(user);
  } catch (err) {
    if (err.name === "ValidationError") {
      next(new BadRequestError("Validation error"));
    } else {
      next(new ServerError("An error occurred while updating user data"));
    }
  }

  // Explicit return to satisfy ESLint
  return null;
};

module.exports = {
  getCurrentUser,
  updateUser,
  createUser,
  login,
};
