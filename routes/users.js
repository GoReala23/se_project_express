const express = require("express");
const { getCurrentUser, updateUser } = require("../controllers/user");
const auth = require("../middleware/auth");

const router = express.Router();

router.use(auth);

router.get("/me", getCurrentUser);
router.patch("/me", updateUser);

module.exports = router;
