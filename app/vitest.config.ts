import { defineConfig } from "vitest/config";
import path from "path";

// Force the test environment before Vite resolves React.
// Without this, a shell-level NODE_ENV=production makes React 19 load its
// production build, which omits `act` and breaks @testing-library/react@16.
// See: https://github.com/testing-library/react-testing-library/issues/1320
// Object.assign bypasses Next.js' readonly typing on process.env.NODE_ENV.
if (!process.env.NODE_ENV || process.env.NODE_ENV === "production") {
  Object.assign(process.env, { NODE_ENV: "test" });
}

export default defineConfig({
  test: {
    globals: true,
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "server-only": path.resolve(__dirname, "./src/test-shims/server-only.ts"),
    },
  },
});
