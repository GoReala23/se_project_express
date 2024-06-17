const express = require("express");
const clothingItem = require("./clothingItem");
const user = require("./users");
const likes = require("./likes");
const { login, createUser } = require("../controllers/user");

const router = express.Router();

router.post("/signup", createUser);
router.post("/signin", login);

router.use("/items", clothingItem);
router.use("/users", user);
router.use("/items", likes);

module.exports = router;
