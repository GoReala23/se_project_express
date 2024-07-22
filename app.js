const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const routes = require("./routes/index");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

mongoose.connect("mongodb://localhost:27017/wtwr_db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use("/", routes);

// Error-handling middleware for 404 Not Found
app.use((req, res) => {
  res.status(404).send({ message: "Resource Not Found" });
});

// Start server
app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
