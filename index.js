const express = require("express");
const logger = require("morgan");
require("dotenv").config();

const http = require("http");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

// Server creation
const server = http.createServer(app);

const port = 9091;

// Database connection
mongoose
  .connect(process.env.MONGODB_URI, {})
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log("Error in connecting to the database", err);
  });

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(logger("dev"));

app.use("/ping", (req, res) => {
  res.json({ message: "pong" });
});

app.use("/api/user/", require("./routes/userRoute"));

server.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
