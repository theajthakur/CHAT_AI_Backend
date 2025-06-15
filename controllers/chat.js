const checkRoomExistByEmail = async (email) => {
  try {
    const roomExist = await ChatRoom.findOne({ email });
    if (roomExist) return roomExist;
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const checkRoomExistById = async (roomId) => {
  try {
    const roomExist = await ChatRoom.findOne({ roomId });
    const user = await User.findOne({ email: roomExist.email });
    console.log(roomExist, user);
    if (roomExist) return { ...roomExist.toObject(), user };
    return false;
  } catch (error) {
    return false;
  }
};

const { v4: uuidv4 } = require("uuid");
const ChatRoom = require("../models/ChatRoom");
const User = require("../models/User");
const Chats = require("../models/Chats");

const fetchAllChats = async (req, res) => {
  try {
    const { roomId } = req.body;
    if (!roomId)
      return res.json({ status: "error", message: "No RoomID Found!" });
    const chats = await Chats.find({ roomId });
    return res.json({
      status: "success",
      message: "Chat Fetched successfully!",
      chats,
    });
  } catch (error) {
    console.log(error);
    return res.json({ status: "error", message: "Error fetching chats!" });
  }
};

const fetchRoomDetail = async (req, res) => {
  const { roomId } = req.body;
  if (!roomId) return res.json({ status: "error", message: "Room not exists" });
  try {
    const roomexist = await checkRoomExistById(roomId);
    if (roomexist)
      return res.json({
        status: "success",
        message: "Room already exists!",
        data: roomexist,
      });

    return res.json({
      status: "error",
      message: "Room does not exists!",
    });
  } catch (error) {
    console.log(error);
    return res.json({ status: "error", message: "Something went wrong!" });
  }
};

const handleRoomDelete = async (req, res) => {
  try {
    const { roomId } = req.body;
    const roomdata = await checkRoomExistById(roomId);

    if (!roomdata)
      return res.json({ status: "error", message: "Room does not exists!" });

    if (roomdata?.email != req.user?.email)
      return res.json({
        status: "error",
        message: "You have no permission to delete this room!",
      });

    await ChatRoom.deleteOne({ roomId });
    await Chats.deleteMany({ roomId });
    return res.json({
      status: "success",
      message: "Room deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.json({ status: "error", message: "Something went wrong!" });
  }
};

const viewRoomDetail = async (req, res) => {
  try {
    const roomexist = await checkRoomExistByEmail(req.user.email);
    if (roomexist)
      return res.json({
        status: "success",
        code: "roomExist",
        message: "Room already exists!",
        roomId: roomexist.roomId,
      });

    return res.json({
      status: "success",
      code: "available",
      message: "Room does not exists!",
    });
  } catch (error) {
    console.log(error);
    return res.json({ status: "error", message: "Something went wrong!" });
  }
};

const handleCreateRoom = async (req, res) => {
  const { roomName } = req.body;
  try {
    const email = req.user?.email;
    if (!email)
      return res.json({ status: "error", message: "Unauthorised Access!" });

    const roomexist = await checkRoomExistByEmail(email);
    if (roomexist)
      return res.json({
        status: "success",
        code: "roomExist",
        message: "Room already exists!",
        roomId: roomexist.roomId,
      });
    const roomId = uuidv4();

    await ChatRoom.create({ name: roomName, email, roomId });
    return res.json({
      status: "success",
      code: "created",
      message: "Room created successfully",
      roomId,
    });
  } catch (error) {
    console.log(error);
    return res.json({ status: "error", message: "Something went wrong!" });
  }
};

module.exports = {
  fetchAllChats,
  fetchRoomDetail,
  handleRoomDelete,
  viewRoomDetail,
  handleCreateRoom,
};
