const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
// const auth = require("./middleware/auth");
const ERROR_CODES = require("./utils/errors");
const routes = require("./routes");

const { PORT = 3001 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to the database");
  })
  .catch(console.error);

// app.use((req, res, next) => {
//   req.user = {
//     _id: "664bddad77cd2536c8bb6965",
//   };
//   next();
// });

app.use(cors());
// app.use(auth);
app.use("/", routes);

// Error-handling middleware for 404 Not Found
app.use((req, res) => {
  res
    .status(ERROR_CODES.RESOURCE_NOT_FOUND_ERROR)
    .send({ message: "Resource Not Found" });
});

// General error-handling middleware
app.use((err, req, res, next) => {
  if (!res.headersSent) {
    res
      .status(err.status || 500)
      .send({ message: err.message || "An error occurred on the server" });
  }
  next();
});

app.listen(PORT, () => {
  console.log(`This app is listening at http://localhost:${PORT}`);
});
