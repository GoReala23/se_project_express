const validator = require("validator");
const ClothingItem = require("../models/clothingItem");
const ERROR_CODES = require("../utils/errors");

// Create a new clothing item

// Create a new clothing item
const createClothingItem = (req, res) => {
  const { name, weather, imageUrl, owner } = req.body;

  // Check if the name field is missing
  if (!name) {
    return res
      .status(ERROR_CODES.USER_CREATION_ERROR)
      .send({ message: "Name is required" });
  }

  // Check if the name length is less than 2 characters
  if (name.length < 2) {
    return res
      .status(ERROR_CODES.USER_CREATION_ERROR)
      .send({ message: "Name must be at least 2 characters long" });
  }

  // Check if the name length is greater than 30 characters
  if (name.length > 30) {
    return res.status(ERROR_CODES.USER_CREATION_ERROR).send({
      message: "Name must be less than or equal to 30 characters long",
    });
  }

  // Check if the weather field is missing
  if (!weather) {
    return res
      .status(ERROR_CODES.USER_CREATION_ERROR)
      .send({ message: "Weather is required" });
  }

  // Check if the imageUrl field is missing
  if (!imageUrl) {
    return res
      .status(ERROR_CODES.USER_CREATION_ERROR)
      .send({ message: "ImageUrl is required" });
  }

  // Check if the imageUrl is a valid URL
  if (!validator.isURL(imageUrl)) {
    return res
      .status(ERROR_CODES.USER_CREATION_ERROR)
      .send({ message: "Invalid URL for imageUrl field" });
  }

  // Check if the owner field is missing
  if (!owner) {
    return res
      .status(ERROR_CODES.USER_CREATION_ERROR)
      .send({ message: "Owner is required" });
  }

  // Create the clothing item
  return ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => {
      res.status(201).send(item);
    })
    .catch((err) => {
      console.error("Error occurred while creating the clothing item:", err); // Detailed error logging
      return res.status(ERROR_CODES.SERVER_ERROR).send({
        message: "An error occurred while creating the clothing item",
        err,
      });
    });
};

// Get all clothing items
const getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send({ items }))
    .catch((err) => {
      console.log(err);
      res.status(ERROR_CODES.SERVER_ERROR).json({
        message: "An error occurred while getting the clothing items",
      });
    });
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
const updateClothingItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;

  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageUrl } })
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.log(err);
      res.status(ERROR_CODES.SERVER_ERROR).json({
        message: "An error occurred while updating the clothing item",
      });
    });
};
const deleteClothingItem = (req, res) => {
  const { id } = req.params;

  ClothingItem.findByIdAndDelete(id)

    .orFail(() => new Error("ItemNotFound"))
    .then(() => {
      res.status(200).send({ message: "Item deleted successfully" });
    })
    .catch((e) => {
      console.error(e);
      if (e.message === "ItemNotFound") {
        return res
          .status(ERROR_CODES.RESOURCE_NOT_FOUND_ERROR)
          .send({ message: "Item not found" });
      }
      if (e.name === "CastError") {
        return res
          .status(ERROR_CODES.INVALID_ID_ERROR)
          .send({ message: "Invalid item ID format" });
      }
      return res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ message: "An error occurred while deleting the item" });
    });
};

module.exports = {
  createClothingItem,
  getClothingItems,
  getClothingItem,
  updateClothingItem,
  deleteClothingItem,
};
