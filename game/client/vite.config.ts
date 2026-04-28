import { defineConfig } from "vite";
import { resolve } from "node:path";

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@common": resolve(__dirname, "../common/src"),
    },
  },
  server: {
    port: 8000,
    open: true,
  },
});
