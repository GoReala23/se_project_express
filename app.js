const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const clothingItemController = require("./controllers/clothingItem");

// const { clothingItem } = require("./models/clothingItem");
const userController = require("./controllers/user");
// const { user } = require("./models/user");
// const bodyParser = require('body-parser');
const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to the database");
  })
  .catch(console.error);

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

app.get("/users", userController.getUsers);
app.get("/users/:id", userController.getUser);
app.post("/users", userController.createUser);

app.get("/clothingItems", clothingItemController.getClothingItems);
app.post("/clothingItems", clothingItemController.createClothingItem);
app.delete("/clothingItems/:id", clothingItemController.deleteClothingItem);

app.use((req, res, next) => {
  if (!res.headersSent) {
    res.status(404).send("Requested resource not found");
  }
  next();
});

console.log("Hello World!");
console.error("This is an error message");

app.listen(PORT, () => {
  console.log(` this app listening at http://localhost:${PORT}`);
});
