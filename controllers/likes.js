const ClothingItem = require("../models/clothingItem");
const ERROR_CODES = require("../utils/errors");

// Get likes of a clothing item
const getLikes = async (req, res) => {
  try {
    const item = await ClothingItem.findById(req.params.id);
    if (!item) {
      return res.status(ERROR_CODES.RESOURCE_NOT_FOUND_ERROR).json([]); // Return an empty array if the item is not found
    }
    return res.status(200).json(item.likes); // Return the likes of the item
  } catch (err) {
    console.error(err); // Log the error to the console
    return res
      .status(ERROR_CODES.SERVER_ERROR)
      .json({ message: "An error occurred while fetching likes" });
  }
};

// Like a clothing item
const likeItem = async (req, res) => {
  try {
    const updatedItem = await ClothingItem.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    );
    if (!updatedItem) {
      return res.status(ERROR_CODES.RESOURCE_NOT_FOUND_ERROR).json([]); // Return an empty array if the item is not found
    }
    return res.status(200).json(updatedItem); // Return the updated item with the new like
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
      .json({ message: "An error occurred while liking the item" });
  }
};

// Unlike a clothing item
const unlikeItem = async (req, res) => {
  try {
    const updatedItem = await ClothingItem.findByIdAndUpdate(
      req.params.id,
      { $pull: { likes: req.user._id } },
      { new: true }
    );
    if (!updatedItem) {
      return res.status(ERROR_CODES.RESOURCE_NOT_FOUND_ERROR).json([]); // Return an empty array if the item is not found
    }
    return res.status(200).json(updatedItem); // Return the updated item with the unlike
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
      .json({ message: "An error occurred while unliking the item" });
  }
};

module.exports = {
  likeItem,
  unlikeItem,
  getLikes,
};
