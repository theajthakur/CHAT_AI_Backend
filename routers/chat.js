const { Router } = require("express");
const apiSuccessReponse = require("../utils/apiSuccessMessage");

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

module.exports = router;
