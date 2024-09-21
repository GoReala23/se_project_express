require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const { errors } = require("celebrate");
const routes = require("./routes/index");
const errorHandler = require("./middlewares/errorHandler");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

mongoose.connect("mongodb://localhost:27017/wtwr_db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(requestLogger);

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.get("/", (req, res) => {
  res.send("Welcome to What2Wear API");
});

app.use("/", routes);

// Error-handling middleware for 404 Not Found
app.use((req, res) => {
  res.status(404).send({ message: "Resource Not Found" });
});

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

const PORT = process.env.PORT || 3001;

// Start serverpm2 loo
app.listen(PORT, () => {
  console.log("Server is running on port 3001");
});
