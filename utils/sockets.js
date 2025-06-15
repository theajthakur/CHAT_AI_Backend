const Chats = require("../models/Chats");
const { sendMessage } = require("../utils/messageSender");

const socketConnect = async (io) => {
  io.on("connection", (socket) => {
    socket.on("join_room", ({ roomId, user }) => {
      socket.user = user;
      socket.roomId = roomId;
      socket.join(roomId);
      console.log(`User ${user.name} joined room ${roomId}`);

      io.to(roomId).emit("user_connected", user);
    });

    socket.on("send_message", async (data) => {
      sendMessage(io, socket.user, data.roomId, data.message);
      await Chats.create({
        user: socket.user,
        roomId: data.roomId,
        message: data.message,
      });
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
};

module.exports = { socketConnect };
