const mongoose = require("mongoose");
const validator = require("validator");
const ClothingItem = require("../models/clothingItem");
const DefaultClothingItems = require("../utils/const/defaultItems");
const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundError");
const ForbiddenError = require("../errors/ForbiddenError");
const ServerError = require("../errors/ServerError");

// Controller function to create a new clothing item
const createClothingItem = async (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  try {
    // Validate the image URL format
    if (!validator.isURL(imageUrl)) {
      throw new BadRequestError("Invalid URL. Please use a valid URL.");
    }

    // Create and save the new clothing item
    const item = await ClothingItem.create({ name, weather, imageUrl, owner });
    res.status(201).json(item);
  } catch (err) {
    if (err.name === "ValidationError") {
      next(new BadRequestError("Validation error"));
    } else {
      next(new ServerError("An error occurred while creating the item"));
    }
  }
};

// Controller function to get all clothing items
const getClothingItems = async (req, res, next) => {
  try {
    // Fetch all clothing items, including default ones
    const items = await ClothingItem.find({});
    const allItems = [...DefaultClothingItems, ...items];
    res.status(200).json({ items: allItems });
  } catch (err) {
    next(new ServerError("An error occurred while getting the clothing items"));
  }
};

// Controller function to delete a clothing item
const deleteClothingItem = async (req, res, next) => {
  const { id } = req.params;

  try {
    // Check if the item is a default item
    const defaultItem = DefaultClothingItems.find((item) => item._id === id);
    if (defaultItem) {
      res.status(200).json({ message: "Default item deleted" });
      return; // End function execution after sending response
    }

    // Validate MongoDB ObjectID for user-created items
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestError("Invalid item ID format");
    }

    // Find and delete the clothing item
    const item = await ClothingItem.findById(id);
    if (!item) {
      throw new NotFoundError("Item not found");
    }

    // Check if the current user is the owner of the item
    if (item.owner.toString() !== req.user._id) {
      throw new ForbiddenError("You are not authorized to delete this item");
    }

    await ClothingItem.findByIdAndRemove(id);
    res.status(200).json({ message: "Item deleted" });
  } catch (err) {
    next(err); // Pass any error to centralized error handler
  }
};

module.exports = {
  createClothingItem,
  getClothingItems,
  deleteClothingItem,
};
