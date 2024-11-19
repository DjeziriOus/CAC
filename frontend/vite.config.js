import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), eslint()],
  server: {
    historyApiFallback: true,
  },
  resolve: {
    alias: {
      // eslint-disable-next-line
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
