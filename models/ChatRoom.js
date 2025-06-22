const mongoose = require("mongoose");

const ChatRoomSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    default: "Chat Room",
  },
  roomId: {
    type: String,
    required: true,
    index: true,
  },
  roomType: {
    type: String,
    enum: ["individual", "group"],
    default: "group",
  },
  participant: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ChatRoom = mongoose.model("ChatRoom", ChatRoomSchema);
module.exports = ChatRoom;
