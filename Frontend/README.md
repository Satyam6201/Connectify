# Connectify Frontend

Single Page Application (SPA) built with React 19, Vite, Tailwind CSS, DaisyUI, and Stream SDKs.

---

## Features

- **Recruiter Demo Mode**: Instant 1-click login for Demo User 1 (Alex - English/Spanish) and Demo User 2 (Elena - Spanish/English) to test chat and video calls side-by-side.
- **AI Language Assistant Drawer**: Built-in slide-in drawer in chat with Google Gemini AI for instant message translation and grammar coaching with natural tone rewrites.
- **AI Language Partner Bot**: Dedicated interactive practice page (`/ai-partner`) with roleplay scenarios (Ordering Food, Job Interview, Casual Meetup), instant feedback, and Text-to-Speech (TTS) pronunciation.
- **Real-Time 1-on-1 Chat**: Powered by Stream Chat React SDK with unread counters, active states, and custom styling.
- **1-on-1 HD Video Calling**: Powered by Stream Video React SDK with camera, microphone, and call state management.
- **State Management & Data Fetching**: TanStack React Query v5 for cached server state and Zustand for client theme state.
- **Theming & Design**: 32 DaisyUI theme presets, responsive Tailwind CSS layouts, and clean vector iconography using React Icons (`react-icons/fa`, `react-icons/fi`, `react-icons/hi2`, `react-icons/io5`, `react-icons/md`).
- **Real-Time Notification System**: Dynamic toast alerts for incoming friend requests with inline Accept/Decline action buttons.

---

## Available Scripts

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

---

## Environment Configuration

Create a `.env` file in the `frontend` directory:

```env
VITE_STREAM_API_KEY=your_stream_api_key
VITE_API_URL=http://localhost:5001
```
