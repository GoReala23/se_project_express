const express = require("express");
const userController = require("../controllers/user");

const router = express.Router();

// POST /users - creates a new user
router.post("/", userController.createUser);

// Get /users - returns all users
router.get("/", userController.getUsers);

// GET /users/:id - returns a single user by ID
router.get("/:id", userController.getUser);

module.exports = router;
