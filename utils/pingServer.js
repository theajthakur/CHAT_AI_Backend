const pingServer = async () => {
  let SERVER_URL = "";
  try {
    SERVER_URL = `${process.env.APP_URL}/api`;
    console.log(`Attempt Pinging to ${SERVER_URL}`);
    const response = await fetch(SERVER_URL);
    const data = await response.json();
    console.log("Connected to Server!");
    setTimeout(pingServer, 1000 * 60 * 10);
    return data;
  } catch (error) {
    console.log(error);
    console.log(`Failed pinging: ${SERVER_URL}`);
    return {
      status: "error",
      message: error.message || "Server Failed to connect",
    };
  }
};
module.exports = { pingServer };
