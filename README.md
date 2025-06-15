# 💬 Real-Time AI-Powered Chat App

A real-time chat room web application built with **MERN stack**, **Socket.IO**, and **Google Gemini AI**. It enables users to create secure rooms, chat live, and get intelligent AI-generated summaries of their conversations.

---

## 🚀 Features

- 🔐 **User Authentication** (JWT-based, Google login ready)
- 💬 **Live Messaging** with WebSocket (`Socket.IO`)
- 🧠 **AI-Powered Chat Summarizer** using Gemini API
- 🏷️ **Chat Mood Detection** with gradient color themes
- 🏠 **Room Management** – Create, fetch, delete rooms
- 🧾 **Chat History** – Persistent chat logs with timestamps
- 🚫 **Permission Checks** – Only owners can delete rooms
- 📡 **Online Status Events** – Join, leave, and disconnect events
- 🌐 **RESTful APIs** for chat, room, and user data
- ⚡ **Fast UUID-based room creation**

---

## 🧠 AI Chat Summarizer

Each chat room session can be summarized by Google Gemini 2.0:

```json
{
  "chatMood": "joyful",
  "moodColourCode": ["#fceabb", "#f8b500"],
  "summary": "The participants had a fun and energetic conversation filled with jokes and casual updates."
}
```

Uses Gemini's `gemini-2.0-flash` model to generate:

- A mood label (joyful, flirty, confused, etc.)
- A matching two-color HEX gradient
- A short, clear summary of the conversation

---

## 🛠 Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Realtime:** Socket.IO
- **AI Integration:** Google Gemini API
- **Authentication:** JWT (JSON Web Tokens)
- **Utilities:** UUID, dotenv
- **Dev Tools:** Postman, Nodemon

---

## 📦 API Highlights

| Endpoint            | Method | Description                      |
| ------------------- | ------ | -------------------------------- |
| `/api/chat/create`  | POST   | Create a new chat room           |
| `/api/chat/fetch`   | POST   | Get room details                 |
| `/api/chat/chats`   | POST   | Fetch all chats of a room        |
| `/api/chat/delete`  | POST   | Delete a room (owner only)       |
| `/api/chat/view`    | GET    | Check if user already has a room |
| `/api/chat/summary` | POST   | Generate AI summary from chats   |

---

## 🧪 How to Run

```bash

# 1. Clone this repo

git clone https://github.com/yourusername/chat-ai-app.git
cd chat-ai-app

# 2. Install dependencies

npm install

# 3. Set up your environment variables

touch .env

# Add MongoDB URI, JWT secret, Gemini API key, etc.

# 4. Start the server

npm run dev
```

---

## 🔒 Environment Variables (`.env`)

```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_google_gemini_api_key
```

---

## ✨ Future Plans

- [ ] Google OAuth integration
- [ ] Emoji & file sharing support
- [ ] Typing indicators
- [ ] Chat pagination & infinite scroll
- [ ] Message reactions
- [ ] Admin dashboard for room moderation

---

## 🙋‍♂️ Author

**Vijay Thakur**  
🚀 Freelance Full-Stack Developer | MERN Expert  
🔗 [LinkedIn](https://www.linkedin.com/in/theajthakur) | [Portfolio](https://theajthakur.vercel.app)

---

## ⭐️ Give it a Star

If you found this project helpful or interesting, please consider giving it a ⭐️ to support the work!
