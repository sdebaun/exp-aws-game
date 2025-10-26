import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Run tests in Node environment (not browser)
    environment: "node",

    // Include test files
    include: ["**/*.test.ts", "**/*.spec.ts"],

    // Test timeout (WebSocket tests might take a bit)
    testTimeout: 10000,

    // Show test output
    reporters: ["verbose"],
  },
});