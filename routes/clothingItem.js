const express = require("express");
const {
  createClothingItem,
  getClothingItems,
  getClothingItem,
  updateClothingItem,
  deleteClothingItem,
} = require("../controllers/clothingItem");

const router = express.Router();

// POST /items - creates a new clothing item
router.post("/", createClothingItem);

// Other routes...
router.get("/", getClothingItems);
router.get("/:id", getClothingItem);
router.put("/:id", updateClothingItem);
router.delete("/:id", deleteClothingItem);

module.exports = router;
