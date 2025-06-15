const { GoogleGenerativeAI } = require("@google/generative-ai");
const generateAiSummary = async (req, res) => {
  const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const { data } = req.body;
  const query = data.map((d) => `${d.name}: ${d.message}`).join("\n");
  const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" }); // or "gemini-pro"
  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `You are an AI chat summarizer
                  Your job is to:
                  1. Analyze the provided chat messages.
                  2. Determine the overall mood of the conversation (e.g., joyful, sad, angry, casual, flirty, confused, professional, etc.).
                  3. Based on the mood, provide light colours, fitting 2-color HEX gradient in "moodColourCode".
                  4. Give a short, clear summary of the conversation (max 3-4 sentences).

                  Respond only in the following JSON format:

                  {
                    "chatMood": "brief mood label",
                    "moodColourCode": ["#hexcode1", "#hexcode2"],
                    "summary": "Short summary of the conversation"
                  }

                  Now, here is the chat conversation:
                  ---
                  ${query}
                  ---
                  `,
          },
        ],
      },
    ],
  });
  let response = result.response.text();
  return res.json({ status: "success", message: "Retrieved", response });
};

module.exports = { generateAiSummary };
