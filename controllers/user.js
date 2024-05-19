const { user } = require("../models/user");

// Controller function to return all users
const getUsers = async (req, res) => {
  try {
    const users = await user.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller function to return a user by ID
const getUser = async (req, res) => {
  try {
    user.findById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller function to create a new user
const createUser = async (req, res) => {
  const { name, avatar } = req.body;
  try {
    const newUser = await user.create({
      name,
      avatar,
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
};
