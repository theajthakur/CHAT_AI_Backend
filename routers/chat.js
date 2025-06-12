const { Router } = require("express");
const apiSuccessReponse = require("../utils/apiSuccessMessage");
const { v4: uuidv4 } = require("uuid");
const ChatRoom = require("../models/ChatRoom");
const router = Router();

router.get("/", apiSuccessReponse);

router.post("/send", (req, res) => {
  const { roomId, message } = req.body;
  const user = req.user;

  if (!user)
    return res.status(401).json({
      status: "error",
      message: "No user found. Please log in again.",
    });

  if (!roomId || !message)
    return res.status(400).json({
      status: "error",
      message: "All parameters are required.",
    });

  req.io.to(roomId).emit("new_message", {
    message,
    user,
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
  });

  console.log(`Message sent to room ${roomId} by user ${user.id}`);

  return res.status(200).json({
    status: "success",
    message: "Message sent successfully",
  });
});

const checkRoomExistByEmail = async (email) => {
  const roomExist = await ChatRoom.findOne({ email });
  if (roomExist) return roomExist;
  return false;
};

const checkRoomExistById = async (roomId) => {
  const roomExist = await ChatRoom.findOne({ roomId });
  if (roomExist) return roomExist;
  return false;
};

router.post("/delete/room", async (req, res) => {});

router.post("/room/detail", async (req, res) => {
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
});

router.post("/room/delete", async (req, res) => {
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
  return res.json({ status: "success", message: "Room deleted successfully" });
});

router.get("/create/room", async (req, res) => {
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
      message: "Room already exists!",
      roomId,
    });
  } catch (error) {
    console.log(error);
    return res.json({ status: "error", message: "Something went wrong!" });
  }
});

router.post("/create/room", async (req, res) => {
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

    await ChatRoom.create({ email, roomId });
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
});

module.exports = router;
