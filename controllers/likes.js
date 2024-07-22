// const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");
const DefaultClothingItems = require("../utils/const/defaultItems");
const ERROR_CODES = require("../utils/errors");

// Function to check if an item is a default item
const isDefaultItem = (id) =>
  DefaultClothingItems.find((item) => item._id === id);

// Add like to a clothing item
const likeItem = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    const defaultItem = isDefaultItem(id);

    if (defaultItem) {
      if (!defaultItem.likes.includes(userId)) {
        defaultItem.likes.push(userId);
      }
      return res.send(defaultItem);
    }

    const item = await ClothingItem.findById(id);
    if (!item) {
      return res
        .status(ERROR_CODES.RESOURCE_NOT_FOUND_ERROR)
        .send({ message: "Item not found" });
    }

    if (!item.likes.includes(userId)) {
      item.likes.push(userId);
      await item.save();
    }

    return res.send(item);
  } catch (err) {
    return res
      .status(ERROR_CODES.SERVER_ERROR)
      .send({ message: "An error occurred while liking the item" });
  }
};

// Remove like from a clothing item
const unlikeItem = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    console.log(`Unlike request for item ID: ${id} by user ID: ${userId}`);
    const defaultItem = isDefaultItem(id);

    if (defaultItem) {
      const likeIndex = defaultItem.likes.indexOf(userId);
      if (likeIndex !== -1) {
        defaultItem.likes.splice(likeIndex, 1);
        console.log(`Default item with ID ${id} unliked by user ID ${userId}.`);
      }
      return res.send(defaultItem);
    }

    const item = await ClothingItem.findById(id);
    if (!item) {
      console.log(`Item with ID ${id} not found.`);
      return res
        .status(ERROR_CODES.RESOURCE_NOT_FOUND_ERROR)
        .send({ message: "Item not found" });
    }

    const likeIndex = item.likes.indexOf(userId);
    if (likeIndex !== -1) {
      item.likes.splice(likeIndex, 1);
      await item.save();
      console.log(`Item with ID ${id} unliked by user ID ${userId}.`);
    }

    return res.send(item);
  } catch (err) {
    console.error("Error unliking item:", err);
    return res.status(ERROR_CODES.SERVER_ERROR).send({
      message: "An error occurred while unliking the item",
    });
  }
};

module.exports = {
  likeItem,
  unlikeItem,
};
