const User = require("../models/User");

const handleUserSearch = async (req, res) => {
  try {
    const { search } = req.body;

    if (!search || typeof search !== "string" || search.length < 4) {
      return res.status(400).json({
        status: "error",
        message:
          "Search query must be a non-empty string and must be of 4 characters atleast.",
      });
    }

    const users = await User.find({
      name: { $regex: search, $options: "i" },
    }).limit(10);

    return res.status(200).json({
      status: "success",
      message: `${users.length} user${users.length > 1 ? "s" : ""} found.`,
      data: users,
    });
  } catch (error) {
    console.error("Error searching for users:", error);

    return res.status(500).json({
      status: "error",
      message: "An error occurred while searching for users.",
    });
  }
};

module.exports = { handleUserSearch };
