// vite.config.js
import { defineConfig } from "file:///C:/Users/exeed/Desktop/GitHub%20Main%20Depository/CAC/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/exeed/Desktop/GitHub%20Main%20Depository/CAC/node_modules/@vitejs/plugin-react/dist/index.mjs";
import eslint from "file:///C:/Users/exeed/Desktop/GitHub%20Main%20Depository/CAC/node_modules/vite-plugin-eslint/dist/index.mjs";
import path from "path";
import svgr from "file:///C:/Users/exeed/Desktop/GitHub%20Main%20Depository/CAC/node_modules/vite-plugin-svgr/dist/index.js";
var __vite_injected_original_dirname = "C:\\Users\\exeed\\Desktop\\GitHub Main Depository\\CAC";
var vite_config_default = defineConfig({
  plugins: [react(), eslint(), svgr()],
  resolve: {
    alias: {
      // eslint-disable-next-line
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  server: {
    host: "localhost",
    // or '0.0.0.0' to access from other devices
    port: 5555,
    // Change to your desired port
    strictPort: true,
    // Prevents Vite from trying the next available port
    open: true,
    // Opens the browser automatically
    historyApiFallback: true
  }
  // base: "/frontend/", // 👈 Update this to match your deployment path
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxleGVlZFxcXFxEZXNrdG9wXFxcXEdpdEh1YiBNYWluIERlcG9zaXRvcnlcXFxcQ0FDXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxleGVlZFxcXFxEZXNrdG9wXFxcXEdpdEh1YiBNYWluIERlcG9zaXRvcnlcXFxcQ0FDXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9leGVlZC9EZXNrdG9wL0dpdEh1YiUyME1haW4lMjBEZXBvc2l0b3J5L0NBQy92aXRlLmNvbmZpZy5qc1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XHJcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3RcIjtcclxuaW1wb3J0IGVzbGludCBmcm9tIFwidml0ZS1wbHVnaW4tZXNsaW50XCI7XHJcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XHJcbmltcG9ydCBzdmdyIGZyb20gXCJ2aXRlLXBsdWdpbi1zdmdyXCI7XHJcblxyXG4vLyBodHRwczovL3ZpdGUuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbcmVhY3QoKSwgZXNsaW50KCksIHN2Z3IoKV0sXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IHtcclxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXHJcbiAgICAgIFwiQFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpLFxyXG4gICAgfSxcclxuICB9LFxyXG4gIHNlcnZlcjoge1xyXG4gICAgaG9zdDogXCJsb2NhbGhvc3RcIiwgLy8gb3IgJzAuMC4wLjAnIHRvIGFjY2VzcyBmcm9tIG90aGVyIGRldmljZXNcclxuICAgIHBvcnQ6IDU1NTUsIC8vIENoYW5nZSB0byB5b3VyIGRlc2lyZWQgcG9ydFxyXG4gICAgc3RyaWN0UG9ydDogdHJ1ZSwgLy8gUHJldmVudHMgVml0ZSBmcm9tIHRyeWluZyB0aGUgbmV4dCBhdmFpbGFibGUgcG9ydFxyXG4gICAgb3BlbjogdHJ1ZSwgLy8gT3BlbnMgdGhlIGJyb3dzZXIgYXV0b21hdGljYWxseVxyXG4gICAgaGlzdG9yeUFwaUZhbGxiYWNrOiB0cnVlLFxyXG4gIH0sXHJcbiAgLy8gYmFzZTogXCIvZnJvbnRlbmQvXCIsIC8vIFx1RDgzRFx1REM0OCBVcGRhdGUgdGhpcyB0byBtYXRjaCB5b3VyIGRlcGxveW1lbnQgcGF0aFxyXG59KTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFxVixTQUFTLG9CQUFvQjtBQUNsWCxPQUFPLFdBQVc7QUFDbEIsT0FBTyxZQUFZO0FBQ25CLE9BQU8sVUFBVTtBQUNqQixPQUFPLFVBQVU7QUFKakIsSUFBTSxtQ0FBbUM7QUFPekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLE1BQU0sR0FBRyxPQUFPLEdBQUcsS0FBSyxDQUFDO0FBQUEsRUFDbkMsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBO0FBQUEsTUFFTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsSUFDdEM7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUE7QUFBQSxJQUNOLE1BQU07QUFBQTtBQUFBLElBQ04sWUFBWTtBQUFBO0FBQUEsSUFDWixNQUFNO0FBQUE7QUFBQSxJQUNOLG9CQUFvQjtBQUFBLEVBQ3RCO0FBQUE7QUFFRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
