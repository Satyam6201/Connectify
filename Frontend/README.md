# Connectify Frontend

Single Page Application (SPA) built with React 19, Vite, Tailwind CSS, DaisyUI, and Stream SDKs.

---

## Features

- **Meta AI Assistant & Image Creator**: Dedicated full-page AI experience (`/meta-ai`) like Meta AI in WhatsApp—answers questions, explains concepts, writes code, and generates instant high-resolution AI art via `/imagine <prompt>` or the style selector.
- **In-Chat AI Assistant Drawer**: Slide-in drawer inside 1-on-1 chat for instant Meta AI queries, image generation insertion, grammar coaching, and real-time translation.
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
