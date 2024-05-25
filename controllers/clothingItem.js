const validator = require("validator");
const ClothingItem = require("../models/clothingItem");
const ERROR_CODES = require("../utils/errors");

// Get all clothing items
const getClothingItems = async (req, res) => {
  try {
    const clothingItems = await ClothingItem.find();
    return res.status(200).json(clothingItems); // Return all clothing items
  } catch (err) {
    console.error(err); // Log the error to the console
    return res
      .status(ERROR_CODES.SERVER_ERROR)
      .json({ message: "An error occurred while fetching clothing items" });
  }
};

// Get clothing item by ID
const getClothingItem = async (req, res) => {
  try {
    const clothingItem = await ClothingItem.findById(req.params.id);
    if (!clothingItem) {
      return res.status(ERROR_CODES.RESOURCE_NOT_FOUND_ERROR).json([]); // Return an empty array if the item is not found
    }
    return res.status(200).json(clothingItem); // Return the found clothing item
  } catch (err) {
    console.error(err); // Log the error to the console
    // Check if the error is due to an invalid ObjectId
    if (err.kind === "ObjectId") {
      return res
        .status(ERROR_CODES.INVALID_ID_ERROR)
        .json({ message: "Invalid ID format" });
    }
    return res
      .status(ERROR_CODES.SERVER_ERROR)
      .json({ message: "An error occurred while fetching the clothing item" });
  }
};

// Create a new clothing item
const createClothingItem = async (req, res) => {
  const { name, weather, imageUrl } = req.body;

  // Validate the name field
  if (!name) {
    return res
      .status(ERROR_CODES.INVALID_DATA)
      .json({ message: "Name is required" });
  }

  // Check if the name length is less than 2 characters
  if (name.length < 2) {
    return res
      .status(ERROR_CODES.INVALID_DATA)
      .json({ message: "Name must be at least 2 characters long" });
  }

  // Check if the name length is greater than 30 characters
  if (name.length > 30) {
    return res.status(ERROR_CODES.INVALID_DATA).json({
      message: "Name must be less than or equal to 30 characters long",
    });
  }

  // Validate the weather field
  if (!weather) {
    return res
      .status(ERROR_CODES.INVALID_DATA)
      .json({ message: "Weather is required" });
  }

  // Validate the imageUrl field
  if (!imageUrl) {
    return res
      .status(ERROR_CODES.INVALID_DATA)
      .json({ message: "ImageUrl is required" });
  }

  // Check if the imageUrl is a valid URL
  if (!validator.isURL(imageUrl)) {
    return res
      .status(ERROR_CODES.INVALID_DATA)
      .json({ message: "Invalid URL for imageUrl field" });
  }

  try {
    const newItem = new ClothingItem({
      name,
      weather,
      imageUrl,
      owner: req.user._id,
    });
    const savedItem = await newItem.save();
    return res.status(201).json(savedItem); // Return the saved clothing item
  } catch (err) {
    console.error(err); // Log the error to the console
    return res
      .status(ERROR_CODES.SERVER_ERROR)
      .json({ message: "Error saving clothing item" });
  }
};

// Delete clothing item by ID
const deleteClothingItem = async (req, res) => {
  try {
    const deletedClothingItem = await ClothingItem.findByIdAndDelete(
      req.params.id
    ).orFail();
    return res.status(200).json(deletedClothingItem); // Return the deleted clothing item
  } catch (err) {
    console.error(err); // Log the error to the console
    // Check if the error is because the item was not found
    if (err.name === "DocumentNotFoundError") {
      return res
        .status(ERROR_CODES.RESOURCE_NOT_FOUND_ERROR)
        .json({ message: "Clothing item not found" });
    }
    // Check if the error is due to an invalid ObjectId
    if (err.kind === "ObjectId") {
      return res
        .status(ERROR_CODES.INVALID_ID_ERROR)
        .json({ message: "Invalid ID format" });
    }
    return res
      .status(ERROR_CODES.SERVER_ERROR)
      .json({ message: "An error occurred while deleting clothing item" });
  }
};

module.exports = {
  getClothingItems,
  getClothingItem,
  createClothingItem,
  deleteClothingItem,
};
