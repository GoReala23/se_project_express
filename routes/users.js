const express = require("express");

const router = express.Router();

const userController = require("../controllers/user");

// Add an empty line here
// Get /users - returns all users
router.get("/users", userController.getUsers);

// GET /users/:id - returns a single user by ID
router.get("/users/:id", userController.getUser);

// POST /users - creates a new user
router.post("/user", userController.createUser);

module.exports = router;
