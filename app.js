const axios = require("axios");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
const port = 7778;
const { pingServer } = require("./utils/pingServer");
const cors = require("cors");
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.io = io;
  next();
});
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });
});
pingServer();

const authRoutes = require("./routers/auth");
const chatRoutes = require("./routers/chat");
const { authCheck } = require("./middlewares/auth");

app.use("/api/auth", authRoutes);
app.use("/api/chat", authCheck, chatRoutes);

server.listen(port, () =>
  console.log(`Server with Socket.IO listening on port ${port}!`)
);
