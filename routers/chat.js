const { GoogleGenerativeAI } = require("@google/generative-ai");
const { Router } = require("express");
const apiSuccessReponse = require("../utils/apiSuccessMessage");
const { v4: uuidv4 } = require("uuid");
const ChatRoom = require("../models/ChatRoom");
const User = require("../models/User");
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

  console.log(`Message sent to room ${roomId} by user ${user.name}`);

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
  const user = await User.findOne({ email: roomExist.email });
  console.log(roomExist, user);
  if (roomExist) return { ...roomExist.toObject(), user };
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
      message: "Room does not exists!",
    });
  } catch (error) {
    console.log(error);
    return res.json({ status: "error", message: "Something went wrong!" });
  }
});

router.post("/create/room", async (req, res) => {
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
});

router.post("/room/summarize", async (req, res) => {
  const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const { data } = req.body;
  const query = data.map((d) => `${d.name}: ${d.message}`).join("\n");
  console.log(query);

  const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" }); // or "gemini-pro"

  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `You are an AI chat summarizer
                  Your job is to:
                  1. Analyze the provided chat messages.
                  2. Determine the overall mood of the conversation (e.g., joyful, sad, angry, casual, flirty, confused, professional, etc.).
                  3. Based on the mood, provide light colours, fitting 2-color HEX gradient in "moodColourCode".
                  4. Give a short, clear summary of the conversation (max 3-4 sentences).

                  Respond only in the following JSON format:

                  {
                    "chatMood": "brief mood label",
                    "moodColourCode": ["#hexcode1", "#hexcode2"],
                    "summary": "Short summary of the conversation"
                  }

                  Now, here is the chat conversation:
                  ---
                  ${query}
                  ---
                  `,
          },
        ],
      },
    ],
  });

  let response = result.response.text();
  response = response.replaceAll(req.user.name, "You");
  return res.json({ status: "success", message: "Retrieved", response });
});

module.exports = router;
