const mongoose = require("mongoose");

const ChatRoomSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  roomId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ChatRoom = mongoose.model("ChatRoom", ChatRoomSchema);
module.exports = ChatRoom;
