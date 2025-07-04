import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "pinia-plugin-logger": path.resolve(
        __dirname,
        "../../src/piniaPluginLogger.ts"
      ), // 라이브러리 직접 참조
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
});
