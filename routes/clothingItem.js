const express = require("express");

const router = express.Router();

const clothingItemController = require("../controllers/clothingItem");

// Get /clothingItems - returns all clothingItems
router.get("/", clothingItemController.getClothingItems);

router.get("/items/:id", clothingItemController.getClothingItem);

// POST /clothingItems - creates a new clothingItem
router.post("/items", clothingItemController.createClothingItem);

// Delete /clothingItems/:clothingItemId - deletes a clothingItem by _id
router.delete("/:clothingItemId", clothingItemController.deleteClothingItem);

// Get /clothingItems/:id/likes - returns the likes of a clothingItem by _id
router.get("/items/:id/likes", clothingItemController.getClothingLikes);

module.exports = router;
