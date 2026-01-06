<img width="1024" height="1024" alt="image" src="https://github.com/user-attachments/assets/443baa7c-c7d1-4870-8f7a-79f10ba0d52a" />

# 💬 Connectify – Real-Time Chat & Video Calling App

<p align="center">
  <img src="https://skillicons.dev/icons?i=react,nodejs,express,mongodb,tailwind,vite,javascript&perline=7" />
</p>

Connectify is a **full-stack real-time chat and video calling application** built using modern web technologies.  
It supports secure authentication, real-time messaging, video calls, and a responsive modern UI.

---

## ✨ Features

### 🔐 Authentication
- JWT-based authentication
- Secure login & signup
- Protected routes
- Cookie-based sessions

### 👥 Friends System
- Send & accept friend requests
- Recommended users
- Manage friend list

### 💬 Real-Time Chat
- Instant messaging
- Message persistence
- Typing indicators
- Stream Chat integration

### 📹 Video Calling
- One-to-one video calls
- Real-time audio & video
- Stream Video SDK support

### 🎨 UI & UX
- 32+ UI themes
- Light / Dark mode
- Fully responsive layout
- Modern Tailwind + DaisyUI design

### 🛡️ Backend
- RESTful API
- Secure middleware
- Clean MVC architecture
- Environment-based configs

---

## 🛠️ Tech Stack

### Frontend
- **React.js**
- **Vite**
- **Tailwind CSS**
- **DaisyUI**
- **Zustand (State Management)**
- **TanStack Query**
- **Axios**

### Backend
- **Node.js**
- **Express.js**
- **MongoDB**
- **Mongoose**
- **JWT Authentication**
- **Cookie Parser**
- **CORS**

### Real-Time
- **Stream Chat API**
- **Stream Video SDK**

---

## 📁 Project Structure

```
Connectify/
│
├── backend/
│ ├── src/
│ │ ├── controllers/
│ │ ├── lib/
│ │ ├── middleware/
│ │ ├── models/
│ │ ├── routes/
│ │ └── server.js
│ ├── .env
│ ├── package.json
│ └── package-lock.json
│
├── frontend/
│ ├── dist/
│ ├── public/
│ ├── src/
│ │ ├── components/
│ │ ├── constants/
│ │ ├── hooks/
│ │ ├── lib/
│ │ ├── pages/
│ │ ├── store/
│ │ ├── App.jsx
│ │ ├── main.jsx
│ │ └── index.css
│ ├── index.html
│ ├── vite.config.js
│ ├── tailwind.config.js
│ ├── postcss.config.js
│ └── package.json
│
├── package.json
├── package-lock.json
└── README.md
```


---

## ⚙️ Environment Variables

Create a `.env` file inside the **backend** folder:

```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_jwt_secret
STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret
```
