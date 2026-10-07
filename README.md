# Connectify

Real-Time Language Exchange, 1-on-1 Chat, HD Video Calls, and Gemini AI Language Assistance.

<p align="center">
  <img src="https://img.shields.io/badge/Stack-MERN%20+%20Redis-blue?style=for-the-badge" alt="Stack" />
  <img src="https://img.shields.io/badge/AI-Gemini%203.5-orange?style=for-the-badge" alt="Gemini" />
  <img src="https://img.shields.io/badge/RealTime-Stream%20SDK-005fff?style=for-the-badge" alt="Stream" />
  <img src="https://img.shields.io/badge/Security-Redis%20Rate%20Limit-red?style=for-the-badge" alt="RateLimit" />
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <a href="https://connectify-videocall.vercel.app" target="_blank"><img src="https://img.shields.io/badge/Live-Demo-green?style=for-the-badge" alt="Live Demo" /></a>
  <a href="https://github.com/Satyam6201/Connectify" target="_blank"><img src="https://img.shields.io/badge/Source-Code-blue?style=for-the-badge" alt="Source Code" /></a>
</p>

---

## Overview

Connectify is a high-performance web platform designed to connect language learners worldwide. Users can discover language exchange partners, manage friend requests, chat in real time, launch HD video calls, get instant help and generate images with Meta AI, check message grammar, translate text instantly, and customize their interface with 32 theme presets.

The application is built for scalability and low latency, featuring Redis caching, distributed sliding-window rate limiting, MongoDB indexing, Gzip compression, Vite vendor code-splitting, and Docker containerization.

---

## Key Features

### Recruiter and Quick Demo Mode
- **1-Click Demo Login**: Instantly log in as Demo User 1 (*Alex - Native English, Learning Spanish*) or Demo User 2 (*Elena - Native Spanish, Learning English*) right from the login screen.
- Pre-configured friendships and synchronized Stream Chat credentials allow interviewers and recruiters to test real-time chat, HD video calling, and toast alerts side-by-side across two browser windows in seconds.

### Meta AI Assistant & AI Image Generation
- **Ask Anything & Chat Assistant**: Versatile conversational AI (works like Meta AI in WhatsApp) providing answers to general knowledge questions, language learning, programming solutions, and writing assistance.
- **Instant AI Image Generation**: Generate stunning, high-resolution artwork and graphics by typing `/imagine <prompt>` or selecting the dedicated Image Mode with customizable art styles (Cinematic, Anime, Cyberpunk, 3D Render, Oil Painting, Photorealistic).
- **Interactive Fullscreen & Download**: View generated images in HD modal preview and download with one click.
- **Real-Time Message Translation**: Translate any text or incoming message into your native or target language.
- **AI Grammar and Tone Coach**: Instant grammar checking with corrections, explanations, and natural phrasing suggestions before sending.
- **Text-to-Speech Pronunciation**: Listen to natural speech synthesis directly from AI answers.

### Authentication and Security
- Secure session management using JSON Web Tokens (JWT) stored in HTTP-Only cookies.
- Automatic password salting and hashing with Bcrypt pre-save hooks.
- Route protection middleware for authenticated endpoints.
- Distributed Redis sliding-window rate limiting with an in-memory fallback store.

### Language Exchange and Partner Discovery
- Mutual match detection: Identifies and highlights users whose target language matches your native language and vice-versa.
- Multi-criteria filtering: Filter learners by name, location, native language, and learning language.
- Profile management: Update bio, location, languages, and generate new avatar styles.
- Friendship lifecycle: Send, accept, decline, or cancel friend requests.
- Mutual unfriending: Remove friends with full bi-directional database cleanup.

### Real-Time Chat and Video Calling
- Direct 1-on-1 messaging powered by Stream Chat SDK.
- 1-on-1 HD video calling powered by Stream Video SDK with microphone and camera controls.
- Integrated AI Language Coach drawer inside the chat view.
- In-chat video call launcher with join links.

### Notifications
- Real-time toast notifications for incoming friend requests with instant Accept and Decline actions.
- Dynamic unread count badges in navigation bars.

### UI and Theming
- 32 theme presets using Tailwind CSS and DaisyUI.
- Theme persistence synced to local storage via Zustand.
- Responsive layouts for desktop and mobile devices with React Icons.

---

## Project Structure

```
Connectify/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── ai.controller.js
│   │   │   ├── auth.controller.js
│   │   │   ├── chat.controller.js
│   │   │   └── user.controller.js
│   │   ├── lib/
│   │   │   ├── db.js
│   │   │   ├── gemini.js
│   │   │   ├── redis.js
│   │   │   └── stream.js
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js
│   │   │   └── rateLimiter.js
│   │   ├── models/
│   │   │   ├── FriendRequest.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── ai.route.js
│   │   │   ├── auth.route.js
│   │   │   ├── chat.route.js
│   │   │   └── user.route.js
│   │   └── server.js
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AIAssistantDrawer.jsx
│   │   │   ├── CallButton.jsx
│   │   │   ├── ChatLoader.jsx
│   │   │   ├── EditProfileModal.jsx
│   │   │   ├── FriendCard.jsx
│   │   │   ├── LanguageFlag.jsx
│   │   │   ├── Layout.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── NoFriendsFound.jsx
│   │   │   ├── NoNotificationsFound.jsx
│   │   │   ├── PageLoader.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── ThemeSelector.jsx
│   │   ├── hooks/
│   │   │   ├── useAuthUser.js
│   │   │   ├── useLogin.js
│   │   │   ├── useLogout.js
│   │   │   ├── useRealtimeNotifications.js
│   │   │   └── useSignup.js
│   │   ├── lib/
│   │   │   ├── api.js
│   │   │   ├── axios.js
│   │   │   ├── notificationToast.jsx
│   │   │   └── utils.js
│   │   ├── pages/
│   │   │   ├── CallPage.jsx
│   │   │   ├── ChatPage.jsx
│   │   │   ├── FriendsPage.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── MetaAIPage.jsx
│   │   │   ├── NotificationsPage.jsx
│   │   │   ├── OnboardingPage.jsx
│   │   │   └── SignUpPage.jsx
│   │   ├── store/
│   │   │   └── useThemeStore.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── Dockerfile
│   ├── nginx.conf
│   └── vite.config.js
│
├── docker-compose.yml
├── package.json
└── README.md
```

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS, DaisyUI, Framer Motion, React Icons |
| **State & Data Fetching** | TanStack React Query v5, Zustand, Axios |
| **Real-Time Communication** | Stream Chat React SDK, Stream Video React SDK |
| **AI Engine** | Google Generative AI (Gemini 3.5 / Flash) & Pollinations.ai Image Engine |
| **Backend & Runtime** | Node.js, Express.js (ES Modules), Gzip Compression, Cookie-Parser, CORS |
| **Database & Caching** | MongoDB (Mongoose), Redis 7 (ioredis) |
| **Security & Rate Limiting** | JWT, Bcrypt.js, Redis Sliding Window Rate Limiter |
| **DevOps & Containers** | Docker, Docker Compose, Nginx Alpine |

---

## API Endpoints Reference

### Authentication Routes (`/api/auth`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/demo-login` | 1-Click Recruiter Demo Login (`user1` or `user2`) |
| `POST` | `/api/auth/signup` | Register a new user account |
| `POST` | `/api/auth/login` | Log in and issue JWT cookie |
| `POST` | `/api/auth/logout` | Clear JWT session cookie |
| `POST` | `/api/auth/onboarding` | Complete initial profile onboarding |
| `PUT` | `/api/auth/profile` | Update profile bio, location, languages, avatar |
| `GET` | `/api/auth/me` | Fetch current authenticated user |

### AI Assistance & Image Generation Routes (`/api/ai`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/ai/chat` | Chat with Meta AI assistant / Q&A / `/imagine` parsing |
| `POST` | `/api/ai/generate-image` | Generate AI image from prompt with customizable styles |
| `POST` | `/api/ai/translate` | Translate text into target language using Gemini AI |
| `POST` | `/api/ai/grammar-check` | Analyze sentence grammar, tone, and suggest alternatives |

### User and Friendship Routes (`/api/users`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/users` | Get recommended learners (supports `search`, `nativeLanguage`, `learningLanguage`) |
| `GET` | `/api/users/friends` | Get current user's friends list |
| `DELETE` | `/api/users/friends/:id` | Remove a friend (mutual unfriending) |
| `POST` | `/api/users/friend-request/:id` | Send a friend request |
| `PUT` | `/api/users/friend-request/:id/accept` | Accept an incoming friend request |
| `DELETE` | `/api/users/friend-request/:id/reject` | Decline an incoming friend request |
| `DELETE` | `/api/users/friend-request/:id/cancel` | Cancel an outgoing pending friend request |
| `GET` | `/api/users/friend-requests` | Get pending incoming and accepted requests |
| `GET` | `/api/users/outgoing-friend-requests` | Get pending outgoing requests |

### Chat and Video Routes (`/api/chat`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/chat/token` | Generate Stream user token for Chat and Video SDK |

---

## Environment Variables Configuration

### Backend (`backend/.env`)
```env
PORT=5001
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_secure_jwt_secret_key
STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret
GEMINI_API_KEY=your_gemini_api_key
REDIS_URI=redis://localhost:6379
CLIENT_URL=http://localhost:5173
```

### Frontend (`frontend/.env`)
```env
VITE_STREAM_API_KEY=your_stream_api_key
VITE_API_URL=http://localhost:5001
```

---

## Installation and Setup

### Method 1: Running with Docker Compose (Recommended)

```bash
# Build and run Redis, Backend API, and Frontend SPA
docker compose up --build
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5001`
- Redis: `localhost:6379`

### Method 2: Running Locally

```bash
# 1. Install dependencies
npm run install

# 2. Start Redis server
redis-server

# 3. Start development servers
# Terminal 1 - Backend:
cd backend
npm run dev

# Terminal 2 - Frontend:
cd frontend
npm run dev
```

---

## Production Deployment

### Backend Deployment (Render / Railway / VPS)
1. Set Root Directory to `backend`.
2. Build Command: `npm install`.
3. Start Command: `npm start`.
4. Add environment variables (`MONGO_URI`, `JWT_SECRET_KEY`, `STREAM_API_KEY`, `STREAM_API_SECRET`, `GEMINI_API_KEY`, `CLIENT_URL`, `REDIS_URI`).

### Frontend Deployment (Vercel / Netlify / Cloudflare Pages)
1. Set Root Directory to `frontend`.
2. Framework Preset: `Vite`.
3. Build Command: `npm run build`.
4. Output Directory: `dist`.
5. Add environment variables (`VITE_STREAM_API_KEY`, `VITE_API_URL`).

---

## License

This project is licensed under the ISC License.
