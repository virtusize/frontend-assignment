import { Config } from "jest";

const config: Config = {
  testEnvironment: "jest-fixed-jsdom",
  setupFilesAfterEnv: ["<rootDir>/setup-test.ts"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/_mocks_/fileMock.js",
  },
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/*.{spec,test}.{js,jsx,ts,tsx}",
    "!**/node_modules/**",
    "!**/vendor/**",
    "!**/dist/**",
    "!**/build/**",
    "!vite.config.ts",
    "!**/coverage/**",
  ],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "setup-test.ts",
    "vite-env.d.ts",
  ],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
};

export default config;
