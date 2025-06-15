const mongoose = require("mongoose");
require("dotenv").config();

const MAX_RETRIES = 5;
let retryCount = 0;
const RETRY_DELAY = 3000; // 3 seconds

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_STRING);
    console.log("MongoDB connected");
    retryCount = 0; // reset on success
  } catch (error) {
    console.error(
      `MongoDB connection error (attempt ${retryCount + 1}):`,
      error
    );
    retryCount++;
    if (retryCount < MAX_RETRIES) {
      setTimeout(connectDB, RETRY_DELAY);
    } else {
      console.error("Max retry attempts reached. Exiting.");
      process.exit(1);
    }
  }
};

module.exports = connectDB;
