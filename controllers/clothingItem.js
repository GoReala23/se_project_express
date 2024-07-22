const mongoose = require("mongoose");
const validator = require("validator");
const ClothingItem = require("../models/clothingItem");
const DefaultClothingItems = require("../utils/const/defaultItems");
const ERROR_CODES = require("../utils/errors");

const createClothingItem = async (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  try {
    if (!validator.isURL(imageUrl)) {
      return res.status(ERROR_CODES.BAD_REQUEST).json({
        message: "Invalid URL. Please use a valid URL instead of a link.",
      });
    }

    const item = await ClothingItem.create({ name, weather, imageUrl, owner });
    return res.status(201).json(item);
  } catch (err) {
    console.error("Error creating item:", err);
    if (err.name === "ValidationError") {
      return res.status(ERROR_CODES.BAD_REQUEST).json({
        message: "Validation error",
      });
    }
    return res.status(ERROR_CODES.SERVER_ERROR).json({
      message: "An error occurred while creating the item",
    });
  }
};
const getClothingItems = async (req, res) => {
  console.log("Get clothing items request received");

  try {
    // Fetch all clothing items from the database
    const items = await ClothingItem.find({});
    // Combine default items with items from the database
    const allItems = [...DefaultClothingItems, ...items];
    console.log("Clothing items retrieved:", allItems);
    res.status(200).json({ items: allItems });
  } catch (err) {
    console.error("Error occurred while getting the clothing items:", err);
    // Handle server error
    res.status(ERROR_CODES.SERVER_ERROR).json({
      message: "An error occurred while getting the clothing items",
    });
  }
};

// Controller function to delete a clothing item
const deleteClothingItem = async (req, res) => {
  const { id } = req.params;

  console.log(`Delete request received for item ID: ${id}`);

  // Check if the item is a default item
  const isDefaultItem = DefaultClothingItems.some((item) => item._id === id);

  // Validate item ID format if it's not a default item
  if (!isDefaultItem && !mongoose.Types.ObjectId.isValid(id)) {
    console.log("Invalid item ID format");
    return res.status(400).json({ message: "Invalid item ID format" });
  }

  try {
    if (isDefaultItem) {
      console.log("Default item deleted successfully");
      return res.json({ message: "Default item deleted" });
    }

    // Find the item by ID
    const item = await ClothingItem.findById(id);
    if (!item) {
      console.log("Item not found in the database");
      return res.status(404).json({ message: "Item not found" });
    }

    // Check if the current user is the owner of the item
    if (item.owner.toString() !== req.user._id) {
      console.log("User is not authorized to delete this item");
      return res.status(403).json({ message: "Forbidden" });
    }

    // Remove the item from the database
    await ClothingItem.findByIdAndRemove(id);
    console.log("Item deleted successfully");
    return res.json({ message: "Item deleted" });
  } catch (err) {
    console.error("Error occurred while deleting the item:", err);
    return res.status(500).json({
      message: "An error occurred while deleting the item",
    });
  }
};
module.exports = {
  createClothingItem,
  getClothingItems,
  deleteClothingItem,
};
