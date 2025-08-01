import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: process.env.VITE_CYPRESS_BASE_URL || "http://localhost:5173",
    supportFile: "_tests_/e2e/support.ts",
    specPattern: "_tests_/e2e/**/*.cy.{js,ts,jsx,tsx}",
    video: false,
    screenshotOnRunFailure: false,
  },
  env: {
    username: "testuser",
    password: "newpass123",
  },
});
