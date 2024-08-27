const express = require("express");
const {
  validateClothingItem,
  validateId,
} = require("../middlewares/validation");
const auth = require("../middlewares/auth");
const {
  createClothingItem,
  getClothingItems,
  deleteClothingItem,
} = require("../controllers/clothingItem");

const router = express.Router();

router.get("/", getClothingItems);

router.use(auth);

// POST /items - creates a new clothing item
router.post("/", validateClothingItem, createClothingItem);

// Other routes...

router.delete("/:id", validateId, deleteClothingItem);

module.exports = router;
