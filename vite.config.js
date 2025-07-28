import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    host: "0.0.0.0", // Allows access from other devices
    port: 5173, // Change if needed
    proxy: {
      "/socket.io": {
        target: "http://10.239.10.175:3001", // Replace with your backend's local network IP
        ws: true, // Enable WebSocket support
        changeOrigin: true, // Helps with CORS issues
      },
    },
  },
});
