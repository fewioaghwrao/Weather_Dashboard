// jest.config.cjs
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  testEnvironment: "jsdom",

  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": "babel-jest",
  },

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  // 🔽 ここを修正
  transformIgnorePatterns: [
    "/node_modules/(?!(jose)/)", // jose だけ Babel 通す
  ],
};

module.exports = createJestConfig(customJestConfig);
