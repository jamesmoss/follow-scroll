import { defineConfig } from "vite";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: [
        resolve(__dirname, "src/follow-scroll.ts"),
        resolve(__dirname, "src/use-follow-scroll.ts"),
      ],
      formats: ["es"],
    },
    rollupOptions: {
      external: ["react"],
    },
  },
  resolve: { alias: { src: resolve("src/") } },
});
