const sendMessage = (io, user, roomId, message) => {
  io.to(roomId).emit("new_message", {
    message,
    user,
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
  });

  console.log(`Message sent to room ${roomId} by user ${user.name}`);
};

module.exports = { sendMessage };
