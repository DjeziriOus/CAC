import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";
import path from "path";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), eslint(), svgr()],
  resolve: {
    alias: {
      // eslint-disable-next-line
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "localhost", // or '0.0.0.0' to access from other devices
    port: 5555, // Change to your desired port
    strictPort: true, // Prevents Vite from trying the next available port
    open: true, // Opens the browser automatically
    historyApiFallback: true,
  },
  base: "/frontend/", // 👈 Update this to match your deployment path
});
