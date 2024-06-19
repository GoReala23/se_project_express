const express = require("express");
const {
  createClothingItem,
  getClothingItems,
  deleteClothingItem,
} = require("../controllers/clothingItem");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", getClothingItems);

router.use(auth);

// POST /items - creates a new clothing item
router.post("/", createClothingItem);

// Other routes...

router.delete("/:id", deleteClothingItem);

module.exports = router;
