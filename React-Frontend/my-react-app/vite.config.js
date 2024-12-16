import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0', // Allow access from any device on the network
    port: 5173, // Default port
    proxy: {
      '/api': {
        target: 'http://localhost:7000', // Your backend API URL
        changeOrigin: true,
        secure: false, // Set to true if you're using HTTPS in development
      },
    },
  },
  plugins: [react()],
})
