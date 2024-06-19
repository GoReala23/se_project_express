const { default: mongoose } = require("mongoose");
const ClothingItem = require("../models/clothingItem");

const ERROR_CODES = require("../utils/errors");

const likeItem = (req, res) => {
  const { id } = req.params;
  const userId = req.user._id; // Assuming you get the user ID from the authenticated user

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(ERROR_CODES.BAD_REQUEST)
      .send({ message: "Invalid item ID format" });
  }

  return ClothingItem.findByIdAndUpdate(
    id,
    { $addToSet: { likes: userId } },
    { new: true }
  )
    .orFail(() => new Error("ItemNotFound"))
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error("Error occurred while liking the item:", err);
      if (err.message === "ItemNotFound") {
        return res
          .status(ERROR_CODES.RESOURCE_NOT_FOUND_ERROR)
          .send({ message: "Item not found" });
      }
      return res.status(ERROR_CODES.SERVER_ERROR).send({
        message: "An error occurred while updating the clothing item",
      });
    });
};

const unlikeItem = (req, res) => {
  const { id } = req.params;
  const userId = req.user._id; // Assuming you get the user ID from the authenticated user

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(ERROR_CODES.BAD_REQUEST)
      .send({ message: "Invalid item ID format" });
  }

  return ClothingItem.findByIdAndUpdate(
    id,
    { $pull: { likes: userId } },
    { new: true }
  )
    .orFail(() => new Error("ItemNotFound"))
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error("Error occurred while unliking the item:", err);
      if (err.message === "ItemNotFound") {
        return res
          .status(ERROR_CODES.RESOURCE_NOT_FOUND_ERROR)
          .send({ message: "Item not found" });
      }
      return res.status(ERROR_CODES.SERVER_ERROR).send({
        message: "An error occurred while updating the clothing item",
      });
    });
};

module.exports = {
  likeItem,
  unlikeItem,
};
