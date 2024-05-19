const express = require("express");

const router = express.Router();

const clothingItemController = require("../controllers/clothingItem");

// Get /clothingItems - returns all clothingItems
router.get("/", clothingItemController.getClothingItems);

// POST /clothingItems - creates a new clothingItem
router.post("/", clothingItemController.createClothingItem);

// Delete /clothingItems/:clothingItemId - deletes a clothingItem by _id
router.delete("/:clothingItemId", clothingItemController.deleteClothingItem);
