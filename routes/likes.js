// routes/likeRoutes.js
const express = require("express");

const likesController = require("../controllers/likes");

const router = express.Router();

// Route to get likes of an item
router.get("/:itemId/likes", likesController.getLikes);
// Route to like an item
router.put("/:itemId/likes", likesController.likeItem);

// Route to unlike an item
router.delete("/:itemId/likes", likesController.unlikeItem);

module.exports = router;
