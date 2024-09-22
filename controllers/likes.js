const ClothingItem = require("../models/clothingItem");
const NotFoundError = require("../errors/NotFoundError");
const ServerError = require("../errors/ServerError");

// Add like to a clothing item
const likeItem = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    const item = await ClothingItem.findById(id);

    if (!item) {
      // Use centralized error handling
      return next(new NotFoundError("Item not found"));
    }

    // Check if the user already liked the item
    if (!item.likes.includes(userId)) {
      item.likes.push(userId);
      await item.save();
    }

    return res.send(item);
  } catch (err) {
    // Centralized error handling
    return next(new ServerError("An error occurred while liking the item"));
  }
};

// Remove like from a clothing item
const unlikeItem = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    const item = await ClothingItem.findById(id);

    if (!item) {
      // Use centralized error handling
      return next(new NotFoundError("Item not found"));
    }

    // Check if the user liked the item and remove the like
    const likeIndex = item.likes.indexOf(userId);
    if (likeIndex !== -1) {
      item.likes.splice(likeIndex, 1);
      await item.save();
    }

    return res.send(item);
  } catch (err) {
    // Centralized error handling
    return next(new ServerError("An error occurred while unliking the item"));
  }
};

module.exports = {
  likeItem,
  unlikeItem,
};
