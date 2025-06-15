const { generateAiSummary } = require("../controllers/AI");
const apiSuccessReponse = require("../utils/apiSuccessMessage");
const {
  fetchAllChats,
  fetchRoomDetail,
  handleRoomDelete,
  handleCreateRoom,
  viewRoomDetail,
} = require("../controllers/chat");

const { Router } = require("express");
const router = Router();

router.get("/", apiSuccessReponse);
router.post("/fetch/all", fetchAllChats);
router.post("/room/detail", fetchRoomDetail);
router.post("/room/delete", handleRoomDelete);
router.get("/create/room", viewRoomDetail);
router.post("/create/room", handleCreateRoom);
router.post("/room/summarize", generateAiSummary);

module.exports = router;
