const mongoose = require("mongoose");

const FriendsSchema = new mongoose.Schema({
  initiator: {
    type: String,
    required: true,
    index: true,
  },
  accepter: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Friends = mongoose.model("Friends", FriendsSchema);
module.exports = Friends;
