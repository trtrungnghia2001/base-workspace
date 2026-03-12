import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
  },
  build: {
    outDir: "dist",
  },
  server: {
    host: true, // Quan trọng: Cho phép truy cập từ bên ngoài container
    port: 5173, // Cổng bạn đã map trong docker-compose
    watch: {
      usePolling: true, // Quan trọng: Giúp hot-reload hoạt động trên Windows/Docker
    },
  },
});
