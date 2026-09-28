<div align="center">
  <img width="100%" max-width="900" alt="Connectify Banner" src="https://github.com/user-attachments/assets/443baa7c-c7d1-4870-8f7a-79f10ba0d52a" style="border-radius: 16px; margin-bottom: 20px;" />

  # 🌐 Connectify – Global Language Exchange, Chat & Video Calling

  <p align="center">
    <strong>Full-Stack Real-Time Language Exchange, 1-on-1 Chat, HD Video Calls & Social Networking</strong>
  </p>

  <p align="center">
    <img src="https://skillicons.dev/icons?i=react,nodejs,express,mongodb,redis,docker,tailwind,vite,javascript&perline=9" />
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/Stack-MERN%20+%20Redis-blue?style=for-the-badge" alt="Stack" />
    <img src="https://img.shields.io/badge/RealTime-Stream%20SDK-005fff?style=for-the-badge" alt="Stream" />
    <img src="https://img.shields.io/badge/Security-Redis%20Rate%20Limit-red?style=for-the-badge" alt="RateLimit" />
    <img src="https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  </p>
</div>

---

## 📖 Overview

**Connectify** is a modern, high-performance web platform designed to connect language learners worldwide. Users can discover language exchange partners, send and receive friend requests, engage in real-time messaging with typing indicators, start crystal-clear 1-on-1 video calls, personalize their profile with dynamic avatars, and customize their interface with 32+ theme presets.

Engineered with scalability in mind, Connectify utilizes **Redis caching**, **distributed rate limiting**, **MongoDB indexing**, **Gzip compression**, **Vite vendor code-splitting**, and **Docker containerization**.

---

## ✨ Key Features

### 🔐 Authentication & Security
- **JWT & HTTP-Only Cookies**: Secure, XSS-resistant and CSRF-protected session management.
- **Bcrypt Hashing**: Automatic pre-save salting and password hashing.
- **Route Protection**: Middleware verification with automatic token refresh handling.
- **Redis Rate Limiting**: Distributed protection against brute-force attacks (`authLimiter`: 10 req / 15 min; `apiLimiter`: 100 req / min) with zero-downtime in-memory fallback.

### 👥 Language Exchange & Social Discovery
- **🎯 "Perfect Match" Detection**: Automatically highlights users whose native language matches your learning language and vice-versa.
- **Live Search & Multi-Filters**: Instant client-side & server-side filtering by name, city/location, native language, and target language.
- **Interactive Profile Editing**: Edit bio, location, languages, and roll new DiceBear avatar previews anytime via modal.
- **Friend Request Workflow**: Send, accept, decline/reject incoming invites, or cancel pending outgoing requests.
- **Mutual Unfriending**: Safely remove friends with confirmation and complete bi-directional database cleanup.

### 💬 Real-Time Messaging & 📹 Video Calling
- **Stream Chat Integration**: Low-latency 1-on-1 direct channels with message persistence, timestamps, and thread support.
- **Stream Video SDK Integration**: 1-on-1 & group HD video calls with camera/mic controls, speaker layout, and screen sharing.
- **Direct Video Call Invites**: One-click video call launcher inside chat with join links sent automatically.

### 🔔 Styled Real-Time Notifications
- **Custom Toast Cards (`react-hot-toast` + `framer-motion`)**:
  - **Friend Request Toast**: Displays sender avatar, details, and interactive **"Accept"** / **"Decline"** buttons right inside the toast.
  - **Direct Message Toast**: Shows user avatar, snippet preview, and one-click navigation to the chat room.
  - **Video Call Alert Toast**: Live animated alert with **"Join"** button.
- **Live Badges**: Dynamic unread counter badges on the top navigation bar and sidebar.

### 🎨 UI/UX & Theming
- **32 Theme Presets**: Powered by Tailwind CSS & DaisyUI (Coffee, Forest, Synthwave, Luxury, Cyberpunk, etc.).
- **Theme Persistence**: Instant theme switching synced to `localStorage` via Zustand.
- **Fluid Micro-Animations**: Page transitions, pulsing presence indicators, and interactive hover states powered by Framer Motion.
- **Responsive Layout**: Desktop sidebar and mobile bottom navigation bar.

---

## 📁 Detailed Folder & File Structure

```
Connectify/
│
├── backend/                                # Node.js & Express API Backend
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.js          # Signup, Login, Logout, Onboarding, Update Profile
│   │   │   ├── chat.controller.js          # Stream Chat Token generation
│   │   │   └── user.controller.js          # Discover users, friends, send/accept/reject/cancel requests, unfriend
│   │   ├── lib/
│   │   │   ├── db.js                       # Mongoose MongoDB connection & error handlers
│   │   │   ├── redis.js                    # ioredis client initialization, event listeners & retry logic
│   │   │   └── stream.js                   # Stream Chat SDK client & user upsert synchronization
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js          # JWT token verification (protectRoute)
│   │   │   └── rateLimiter.js              # Redis-backed rate limiting middleware with in-memory fallback
│   │   ├── models/
│   │   │   ├── FriendRequest.js            # Friend request schema with compound indexes
│   │   │   └── User.js                     # User schema with bcrypt hooks, language fields & indexes
│   │   ├── routes/
│   │   │   ├── auth.route.js               # /api/auth routes (signup, login, logout, onboarding, profile, me)
│   │   │   ├── chat.route.js               # /api/chat routes (token generation)
│   │   │   └── user.route.js               # /api/users routes (recommendations, friends, requests, unfriend)
│   │   └── server.js                       # Express app bootstrap, Gzip compression, CORS, static serving & DB connect
│   ├── .dockerignore                       # Excluded backend files from Docker build context
│   ├── .env                                # Backend environment variables (ignored in Git)
│   ├── Dockerfile                          # Multi-stage/lightweight Node 20 Alpine backend image
│   └── package.json                        # Backend dependencies & scripts
│
├── frontend/                               # Vite + React Single Page Application (SPA)
│   ├── public/
│   │   ├── i.png                           # App promotional illustrations & branding assets
│   │   ├── icon.png                        # App logo icon
│   │   └── vite.svg                        # Vite favicon
│   ├── src/
│   │   ├── components/
│   │   │   ├── CallButton.jsx              # Direct video call launcher button inside chat
│   │   │   ├── ChatLoader.jsx              # Animated Stream chat initialization loader
│   │   │   ├── EditProfileModal.jsx        # Modal for updating profile info & randomized avatar generation
│   │   │   ├── FriendCard.jsx              # Friend display card with language flags & chat link
│   │   │   ├── Layout.jsx                  # Main application layout wrapper (Sidebar + Navbar)
│   │   │   ├── Navbar.jsx                  # Top navigation with animated logo, theme switch, notifications & avatar
│   │   │   ├── NoFriendsFound.jsx          # Empty state graphic for friends page
│   │   │   ├── NoNotificationsFound.jsx    # Empty state graphic for notifications page
│   │   │   ├── PageLoader.jsx              # Full-screen animated application loader
│   │   │   ├── Sidebar.jsx                 # Responsive desktop sidebar & mobile bottom navigation bar
│   │   │   └── ThemeSelector.jsx           # DaisyUI 32-theme selector dropdown
│   │   ├── constants/
│   │   │   └── index.js                    # Theme definitions, supported languages list & country flag mappings
│   │   ├── hooks/
│   │   │   ├── useAuthUser.js              # React Query hook to fetch current authenticated user
│   │   │   ├── useLogin.js                 # React Query login mutation
│   │   │   ├── useLogout.js                # React Query logout mutation
│   │   │   ├── useRealtimeNotifications.js # Real-time polling & toast trigger for incoming friend requests
│   │   │   └── useSignup.js                # React Query signup mutation
│   │   ├── lib/
│   │   │   ├── api.js                      # Centralized Axios API request helpers
│   │   │   ├── axios.js                    # Configured Axios instance with withCredentials enabled
│   │   │   ├── notificationToast.jsx       # Styled custom toast cards for requests, messages & calls
│   │   │   └── utils.js                    # Text formatting & utility functions
│   │   ├── pages/
│   │   │   ├── CallPage.jsx                # Stream Video 1-on-1 video call room with controls
│   │   │   ├── ChatPage.jsx                # Stream Chat 1-on-1 messaging channel
│   │   │   ├── FriendsPage.jsx             # Friends directory with search & remove friend capabilities
│   │   │   ├── HomePage.jsx                # Main feed: friends grid + searchable & filterable learners
│   │   │   ├── LoginPage.jsx               # Login page with animations
│   │   │   ├── NotificationsPage.jsx       # Tabbed incoming requests, outgoing requests & accepted connections
│   │   │   ├── OnboardingPage.jsx          # Initial profile onboarding (languages, bio, location, avatar)
│   │   │   └── SignUpPage.jsx              # User registration page
│   │   ├── store/
│   │   │   └── useThemeStore.js            # Zustand theme store with localStorage persistence
│   │   ├── App.jsx                         # Main router configuration & route protection guards
│   │   ├── index.css                       # Tailwind CSS directives & Stream Chat UI custom styles
│   │   └── main.jsx                        # React root entry point with QueryClientProvider & BrowserRouter
│   ├── .dockerignore                       # Excluded frontend files from Docker build context
│   ├── .env                                # Frontend environment variables
│   ├── Dockerfile                          # Multi-stage production build (Node builder + Nginx Alpine server)
│   ├── nginx.conf                          # Nginx SPA history fallback & reverse proxy configuration
│   ├── package.json                        # Frontend dependencies & scripts
│   ├── postcss.config.js                   # PostCSS configuration for Tailwind
│   ├── tailwind.config.js                  # Tailwind configuration with DaisyUI themes
│   └── vite.config.js                      # Vite build configuration with Rollup manual vendor chunk-splitting
│
├── .dockerignore                           # Root-level Docker ignore file
├── .gitignore                              # Git ignore configuration
├── docker-compose.yml                      # Multi-service Docker orchestrator (Redis, Backend, Frontend)
├── package.json                            # Root convenience scripts for monorepo development
└── README.md                               # Project documentation & reference guide
```

---

## 🛠️ Tech Stack Breakdown

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS, DaisyUI (32 Themes), Framer Motion, Lucide Icons |
| **State & Data Fetching** | TanStack React Query v5, Zustand, Axios |
| **Real-Time Communications**| Stream Chat React SDK, Stream Video React SDK |
| **Backend & Runtime** | Node.js, Express.js (ES Modules), Gzip Compression, Cookie-Parser, CORS |
| **Database & Caching** | MongoDB (Mongoose with Compound Indexing), Redis 7 (ioredis) |
| **Security & Rate Limiting** | JWT (JSON Web Tokens), Bcrypt.js, Redis Sliding Window Rate Limiter |
| **DevOps & Containers** | Docker, Docker Compose, Nginx Alpine |

---

## ⚡ Speed & High-Concurrency Scaling Optimizations

1. **MongoDB Compound Indexing**:
   - `User`: `{ isOnboarded: 1 }`, `{ nativeLanguage: 1, learningLanguage: 1 }`, text index on `fullName`.
   - `FriendRequest`: `{ recipient: 1, status: 1 }`, `{ sender: 1, status: 1 }`, `{ sender: 1, recipient: 1 }`.
   - Eliminates expensive full collection scans ($O(N) \rightarrow O(\log N)$).

2. **Lean Query Serialization (`.lean()`)**:
   - Queries use Mongoose `.lean()` to bypass heavy document hydration, boosting JSON serialization speed by **up to 4x**.

3. **HTTP Response Compression (`compression`)**:
   - Server-side Gzip/Deflate compression reduces API payload sizes by **70%–85%**, cutting network transfer latency.

4. **Vite Rollup Code-Splitting**:
   - Vendor chunks (`vendor-react`, `vendor-query`, `vendor-motion`, `vendor-stream-chat`, `vendor-stream-video`) are split for optimal browser caching.
   - Initial application bundle size was reduced by **~90%** (from 2.4MB down to ~265KB).

5. **Redis Data Caching**:
   - Cache keys with automated TTL and instant cache invalidation upon mutation operations (accepting/declining requests or unfriending).

---

## 🔌 API Endpoints Reference

### Authentication Routes (`/api/auth`)
| Method | Endpoint | Description | Rate Limit |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Register a new user account | 10 req / 15 min |
| `POST` | `/api/auth/login` | Log in and issue JWT cookie | 10 req / 15 min |
| `POST` | `/api/auth/logout` | Clear JWT session cookie | Standard |
| `POST` | `/api/auth/onboarding` | Complete initial profile onboarding | Standard |
| `PUT` | `/api/auth/profile` | Update profile bio, location, languages & avatar | Standard |
| `GET` | `/api/auth/me` | Fetch authenticated user data | Standard |

### User & Friendship Routes (`/api/users`)
| Method | Endpoint | Description | Query Params |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/users` | Get recommended language learners | `search`, `nativeLanguage`, `learningLanguage`, `limit`, `page` |
| `GET` | `/api/users/friends` | Get list of user's friends | None |
| `DELETE` | `/api/users/friends/:id` | Remove a friend (mutual unfriending) | None |
| `POST` | `/api/users/friend-request/:id` | Send a friend request to a user | None |
| `PUT` | `/api/users/friend-request/:id/accept`| Accept an incoming friend request | None |
| `DELETE` | `/api/users/friend-request/:id/reject`| Decline/reject an incoming friend request | None |
| `DELETE` | `/api/users/friend-request/:id/cancel`| Cancel an outgoing pending friend request | None |
| `GET` | `/api/users/friend-requests` | Get pending incoming & accepted requests | None |
| `GET` | `/api/users/outgoing-friend-requests` | Get pending outgoing requests | None |

### Chat & Video Routes (`/api/chat`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/chat/token` | Generate a signed Stream user token for Chat & Video SDK |

---

## ⚙️ Environment Variables Setup

### Backend (`backend/.env`)
```env
PORT=5001
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_secure_jwt_secret_key
STEAM_API_KEY=your_stream_api_key
STEAM_API_SECRET=your_stream_api_secret
REDIS_URI=redis://localhost:6379
```

### Frontend (`frontend/.env`)
```env
VITE_STREAM_API_KEY=your_stream_api_key
```

---

## 🚀 Getting Started

### Option 1: Running with Docker (Recommended)

Make sure [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) are installed.

```bash
# Build and launch all services (Redis, Backend, Frontend)
docker compose up --build
```

- **Frontend Application**: `http://localhost:5173`
- **Backend API**: `http://localhost:5001`
- **Redis Server**: `localhost:6379`

---

### Option 2: Running Locally

#### 1. Clone the repository
```bash
git clone https://github.com/Satyam6201/Connectify.git
cd Connectify
```

#### 2. Install Dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

#### 3. Start Redis Server
```bash
redis-server
```

#### 4. Run Development Servers
```bash
# In one terminal: Start Backend
cd backend
npm run dev

# In another terminal: Start Frontend
cd frontend
npm run dev
```

---

## 🚀 Production Deployment Guide

### Part 1: Deploy Backend to Render

1. Go to [Render Dashboard](https://dashboard.render.com/) and click **New +** -> **Web Service**.
2. Connect your GitHub repository (`Connectify`).
3. Configure the Web Service settings:
   - **Name**: `connectify-backend` (or your choice)
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start` (or `node src/server.js`)
   - **Plan**: Free / Starter
4. Add the following **Environment Variables** in the Render settings:
   - `PORT`: `5001` (or let Render assign automatically)
   - `NODE_ENV`: `production`
   - `MONGO_URI`: `mongodb+srv://...` (your MongoDB Atlas connection URI)
   - `JWT_SECRET_KEY`: `your_jwt_secret_key`
   - `STREAM_API_KEY`: `your_stream_api_key`
   - `STREAM_API_SECRET`: `your_stream_api_secret`
   - `CLIENT_URL`: `https://connectify-videocall.vercel.app`
   - *(Optional)* `REDIS_URI`: Upstash or Render Redis connection URI (rate limiter falls back to in-memory if omitted)
5. Click **Deploy Web Service**.
6. Deployed Backend URL: `https://connectify-6nim.onrender.com`.

---

### Part 2: Deploy Frontend to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New...** -> **Project**.
2. Import your GitHub repository (`Connectify`).
3. In the project setup:
   - **Root Directory**: Click "Edit" and choose `frontend`.
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add the following **Environment Variables** in Vercel:
   - `VITE_STREAM_API_KEY`: `your_stream_api_key`
   - `VITE_API_URL`: `https://connectify-6nim.onrender.com`
5. Click **Deploy**.
6. Once deployed, copy your Vercel URL and update the `CLIENT_URL` environment variable on Render to match your Vercel URL.

---

## 👨‍💻 Author

- **Satyam Kumar Mishra** – [GitHub Profile](https://github.com/Satyam6201)

---

## 📄 License

This project is licensed under the ISC License.
