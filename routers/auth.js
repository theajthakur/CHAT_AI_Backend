const { Router } = require("express");
const verifyGoogleToken = require("../utils/googleAuthVerify");
const jwt = require("jsonwebtoken");
const router = Router();

router.post("/google", async (req, res) => {
  const { token } = req.body;

  try {
    const d = await verifyGoogleToken(token);
    const data = {
      email: d.email,
      name: d.name,
      avatar: d.picture,
    };
    const signToken = jwt.sign(data, process.env.JWT_SECRET);
    res.json({
      status: "success",
      message: "Google login successful",
      data,
      signToken,
    });
  } catch (error) {
    console.error("Google Auth Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to authenticate with Google" });
  }
});

module.exports = router;
