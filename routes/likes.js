const express = require("express");
const { likeItem, unlikeItem } = require("../controllers/likes");

const router = express.Router();

// Route to like an item
router.put("/:id/likes", likeItem);

// Route to unlike an item
router.delete("/:id/likes", unlikeItem);

module.exports = router;
