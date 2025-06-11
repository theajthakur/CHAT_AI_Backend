const jwt = require("jsonwebtoken");

const authCheck = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .send({ error: "Authentication token missing or malformed" });
    }

    const token = authHeader.replace("Bearer ", "").trim();
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded info to request object (e.g., user ID)
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).send({ error: "Please authenticate" });
  }
};

module.exports = { authCheck };
