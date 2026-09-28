import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router'],
          'vendor-query': ['@tanstack/react-query', 'axios', 'zustand'],
          'vendor-stream-chat': ['stream-chat', 'stream-chat-react'],
          'vendor-stream-video': ['@stream-io/video-react-sdk'],
          'vendor-motion': ['framer-motion', 'lucide-react'],
        },
      },
    },
  },
})
