const axios = require("axios");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
const connectDB = require("./utils/db");
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

connectDB();

io.on("connection", (socket) => {
  socket.on("join_room", ({ roomId, user }) => {
    socket.user = user;
    socket.roomId = roomId;
    socket.join(roomId);
    console.log(`User ${user.name} joined room ${roomId}`);

    io.to(roomId).emit("user_connected", user);
  });

  socket.on("send_message", (data) => {
    console.log("works", data);
    sendMessage(io, socket.user, data.roomId, data.message);
  });

  socket.on("disconnect", () => {
    if (socket.user && socket.roomId) {
      console.log(
        `User ${socket.user.name} disconnected from room ${socket.roomId}`
      );

      io.to(socket.roomId).emit("user_disconnected", socket.user);
    }
  });
});

pingServer();

const authRoutes = require("./routers/auth");
const chatRoutes = require("./routers/chat");
const { authCheck } = require("./middlewares/auth");
const { sendMessage } = require("./utils/messageSender");

app.use("/api/auth", authRoutes);
app.use("/api/chat", authCheck, chatRoutes);

server.listen(port, () =>
  console.log(`Server with Socket.IO listening on port ${port}!`)
);
