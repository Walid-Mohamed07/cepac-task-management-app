import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: process.env.REACT_APP_API_URL || "http://localhost:4000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
    },
    allowedHosts: [
      "03352127-a3bb-4d68-81c9-47533c446ab2-00-2ti1i4xcu6no9.kirk.replit.dev",
    ],
  },
});
