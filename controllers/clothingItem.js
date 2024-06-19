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
        return res.status(ERROR_CODES.BAD_REQUEST).send({
          message: "Validation error",
        });
      }
      return res.status(ERROR_CODES.SERVER_ERROR).send({
        message: "An error occurred while creating the item",
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

  // Case 2: Invalid item ID format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(ERROR_CODES.BAD_REQUEST)
      .send({ message: "Invalid item ID format" });
  }

  return (
    ClothingItem.findById(id)
      .then((item) => {
        // Case 3: Item not found
        if (!item) {
          return res
            .status(ERROR_CODES.RESOURCE_NOT_FOUND_ERROR)
            .send({ message: "Item not found" });
        }

        // Case 4: Forbidden - user is not the owner
        if (item.owner.toString() !== req.user._id) {
          return res
            .status(ERROR_CODES.FORBIDDEN)
            .send({ message: "Forbidden" });
        }

        // Case 1: Valid deletion
        return ClothingItem.findByIdAndRemove(id).then(() =>
          res.send({ message: "Item deleted" })
        );
      })
      // Case 5: Server error
      .catch(() =>
        res
          .status(ERROR_CODES.SERVER_ERROR)
          .send({ message: "An error occurred while deleting the item" })
      )
  );
};

module.exports = {
  createClothingItem,
  getClothingItems,
  deleteClothingItem,
};
