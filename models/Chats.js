const mongoose = require("mongoose");

const ChatsSchema = new mongoose.Schema({
  user: {
    type: {
      name: {
        type: String,
      },
      email: {
        type: String,
      },
      avatar: { type: String },
    },
    required: true,
  },
  roomId: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Chats = mongoose.model("Chats", ChatsSchema);
module.exports = Chats;
