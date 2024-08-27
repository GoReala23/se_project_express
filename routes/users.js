const express = require("express");
const { validateUser } = require("../middlewares/validation");
const { getCurrentUser, updateUser } = require("../controllers/user");
const auth = require("../middlewares/auth");

const router = express.Router();

// All routes in this file require authentication
router.use(auth);

// Route to get the current user's information
router.get("/me", getCurrentUser);

// Route to update the current user's information
router.patch("/me", validateUser, updateUser);

module.exports = router;
