import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./components"),
      "@tokens": path.resolve(__dirname, "./tokens"),
      "@assets": path.resolve(__dirname, "./assets"),
    },
  },
  server: {
    port: 3000,
    open: false,
  },
});
