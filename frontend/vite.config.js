import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/auth': 'http://localhost:5000',
      '/governance': 'http://localhost:5000',
      '/tvk': 'http://localhost:5000',
      '/charity': 'http://localhost:5000',
      '/admin': 'http://localhost:5000',
      '/api': 'http://localhost:5000',
      '/health': 'http://localhost:5000',
    }
  }
})
