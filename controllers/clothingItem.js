const { default: mongoose } = require("mongoose");
const ClothingItem = require("../models/clothingItem");
const ERROR_CODES = require("../utils/errors");

// Create a new clothing item
const createClothingItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  // Create the clothing item
  return ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.error("Error occurred while creating the clothing item:", err);

      if (err.name === "ValidationError") {
        return res.status(ERROR_CODES.USER_CREATION_ERROR).send({
          message: "Validation error",
          details: err.errors,
        });
      }
      return res.status(ERROR_CODES.SERVER_ERROR).send({
        message: "An error occurred while creating the item",
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

const deleteClothingItem = (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(ERROR_CODES.INVALID_ID_ERROR)
      .send({ message: "Invalid item ID format" });
  }

  return ClothingItem.findByIdAndDelete(id)
    .orFail(new Error("ItemNotFound"))
    .then(() => res.status(200).send({ message: "Item deleted successfully" }))
    .catch((error) => {
      console.error(error);
      if (error.message === "ItemNotFound") {
        return res.status(404).send({ message: "Item Not Found" }); // Adjusted to match the expected message
      }
      return res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ message: "An error occurred while deleting the item" });
    });
};

module.exports = {
  createClothingItem,
  getClothingItems,
  deleteClothingItem,
};
