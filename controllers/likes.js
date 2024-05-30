const ClothingItem = require("../models/clothingItem");
const ERROR_CODES = require("../utils/errors");

// Like an item
const likeItem = (req, res) => {
  const { id } = req.params;

  ClothingItem.findByIdAndUpdate(
    id,
    {
      $addToSet: { likedBy: req.user._id },
      $inc: { likes: 1 },
    },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res
          .status(ERROR_CODES.RESOURCE_NOT_FOUND_ERROR)
          .send({ message: "Item not found" });
      }
      return res.status(200).send(item);
    })
    .catch((e) => {
      console.error(e);
      if (e.name === "CastError") {
        return res
          .status(ERROR_CODES.INVALID_ID_ERROR)
          .send({ message: "Invalid item ID format" });
      }
      return res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ message: "An error occurred while liking the item" });
    });
};

// Unlike an item
const unlikeItem = (req, res) => {
  const { id } = req.params;

  ClothingItem.findByIdAndUpdate(
    id,
    {
      $pull: { likedBy: req.user._id },
      $inc: { likes: -1 },
    },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res
          .status(ERROR_CODES.RESOURCE_NOT_FOUND_ERROR)
          .send({ message: "Item not found" });
      }
      return res.status(200).send(item);
    })
    .catch((e) => {
      console.error(e);
      if (e.name === "CastError") {
        return res
          .status(ERROR_CODES.INVALID_ID_ERROR)
          .send({ message: "Invalid item ID format" });
      }
      return res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ message: "An error occurred while unliking the item" });
    });
};

module.exports = {
  likeItem,
  unlikeItem,
};
