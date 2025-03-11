const express = require("express");
const logger = require("morgan");
require("dotenv").config();

const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("./config/swaggerConfig");
const { Server } = require("socket.io");

// Importing Sockets
const { ProjectSocket } = require("./Sockets/ProjectSocket");
const { UserSockets } = require("./Sockets/UserSocket");

// Server creation
const server = http.createServer(app);

// Configure Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

exports.io = io;

app.set("io", io);

const port = 9091;

// Listen Socket Connection
io.on("connection", (socket) => {
  ProjectSocket(io);
  UserSockets(io);
});

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
app.use(express.json());

// Définir les routes de Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use("/users/", require("./routes/userRoute"));
app.use("/tasks/", require("./routes/taskRoute"));
app.use("/projects/", require("./routes/projectRoute"));
app.use("/comments/", require("./routes/commentRoute"));

app.get("/", (req, res) => {
  res.send("Bienvenue sur l'API de gestion des tâches !");
});

server.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
