const { Router } = require("express");
const apiSuccessReponse = require("../utils/apiSuccessMessage");

const router = Router();

router.get("/", apiSuccessReponse);

router.post("/send", (req, res) => {
  const { roomId, message } = req.body;
  const user = req.user;
  if (!user)
    return res.json({
      status: "success",
      message: "No User found, Please login again!",
    });

  if (!roomId || !message)
    return res.json({ status: "success", message: "All parameters required!" });

  return res.json({ status: "success", message: "Email sent successfully" });
});

module.exports = router;
