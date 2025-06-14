const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

async function verifyGoogleToken(idToken) {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: CLIENT_ID,
  });
  const payload = ticket.getPayload();
  const user = await User.updateOne(
    { email: payload.email },
    {
      $set: {
        email: payload.email,
        name: payload.name,
        avatar: payload.picture,
      },
    },
    { upsert: true }
  );

  return payload;
}

module.exports = verifyGoogleToken;
