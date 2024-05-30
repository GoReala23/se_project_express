const express = require("express");

const clothingItem = require("./clothingItem");
const user = require("./users");
const likes = require("./likes");

// Routes
const router = express.Router();
router.use("/items", clothingItem);
router.use("/users", user);
router.use("/items", likes);

module.exports = router;
