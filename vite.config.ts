import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [dts()],
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
