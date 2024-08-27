const express = require("express");
const clothingItem = require("./clothingItem");
const user = require("./users");
const likes = require("./likes");
const { login, createUser } = require("../controllers/user");
const { validateLogin, validateUser } = require("../middlewares/validation");

const router = express.Router();

router.post("/signup", validateUser, createUser);
router.post("/signin", validateLogin, login);

router.use("/items", clothingItem);
router.use("/users", user);
router.use("/items", likes);

module.exports = router;
