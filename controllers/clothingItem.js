const clothingItem = require("../models/clothingItem");

const getClothingItems = async (req, res) => {
  try {
    const clothingItems = await clothingItem.find();
    res.status(200).json(clothingItems);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const createClothingItem = async (req, res) => {
  const { name, type, imageUrl } = req.body;
  try {
    const newClothingItem = await clothingItem.create({
      name,
      type,
      imageUrl,
    });
    res.status(201).json(newClothingItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteClothingItem = async (req, res) => {
  try {
    const deletedClothingItem = await clothingItem.findByIdAndDelete(
      req.params.id
    );
    res.status(200).json(deletedClothingItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
};
