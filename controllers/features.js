const Friends = require("../models/Friends");
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

const listAllFriends = async (req, res) => {
  try {
    // Ensure user is authenticated
    const userEmail = req?.user?.email;
    if (!userEmail) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized access. User email is missing.",
      });
    }

    // Fetch friends where the user is the initiator
    const friends = await Friends.find({ initiator: userEmail });

    return res.status(200).json({
      status: "success",
      message: `${friends.length} friend${
        friends.length === 1 ? "" : "s"
      } fetched!`,
      data: friends,
    });
  } catch (error) {
    console.error("Error in listAllFriends:", error);

    // Handle known error types if needed (like DB validation, network, etc.)
    return res.status(500).json({
      status: "error",
      message: "Failed to fetch friends. Please try again later.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = { handleUserSearch, listAllFriends };
