import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: [],
    include: ["src/test/**/*.test.ts", "src/test/**/*.test.tsx"],
    css: true,
  },
});

