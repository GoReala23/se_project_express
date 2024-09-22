const express = require("express");
// const { celebrate, Joi } = require("celebrate");
const { likeItem, unlikeItem } = require("../controllers/likes");
const { validateId } = require("../middlewares/validation");

const router = express.Router();

// Route to like an item
router.put("/:id/likes", validateId, likeItem);

// Route to unlike an item
router.delete("/:id/likes", validateId, unlikeItem);

module.exports = router;
