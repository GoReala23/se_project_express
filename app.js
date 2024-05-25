const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const ERROR_CODES = require("./utils/errors");
const clothingItemController = require("./controllers/clothingItem");
const userController = require("./controllers/user");
const likesController = require("./controllers/likes");

const { PORT = 3001 } = process.env;

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to the database: app line 22");
  })
  .catch(console.error);

app.use((req, res, next) => {
  req.user = {
    _id: "664bddfc77cd2536c8bb6967", // Replace with a valid user ID from your database
  };
  next();
});

// User routes
app.get("/users", userController.getUsers); // Get all users
app.get("/users/:id", userController.getUser); // Get user by ID
app.post("/users", userController.createUser); // Create a new user

// Clothing item routes
app.get("/clothingItems/items", clothingItemController.getClothingItems); // Get all clothing items
app.get("/clothingItems/:id", clothingItemController.getClothingItem); // Get clothing item by ID
app.post("/items", clothingItemController.createClothingItem); // Create a new clothing item
app.delete("/clothingItems/:id", clothingItemController.deleteClothingItem); // Delete a clothing item by ID

// Like routes
app.get("/clothingItems/:id/likes", likesController.getLikes); // Get likes of a clothing item
app.put("/clothingItems/:id/likes", likesController.likeItem); // Like a clothing item
app.delete("/clothingItems/:id/likes", likesController.unlikeItem); // Unlike a clothing item

// Error-handling middleware for 404 Not Found
app.use((req, res, next) => {
  if (!res.headersSent) {
    res
      .status(ERROR_CODES.RESOURCE_NOT_FOUND_ERROR)
      .json({ message: "Requested resource not found" });
  }
  next();
});

// General error-handling middleware
app.use((err, req, res, next) => {
  if (!res.headersSent) {
    res
      .status(err.status || 500)
      .json({ message: err.message || "An error occurred on the server" });
  }
  next();
});

app.listen(PORT, () => {
  console.log(`This app is listening at http://localhost:${PORT}`);
});
