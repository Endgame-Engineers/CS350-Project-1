import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  test: {
    globals: true, // Use Vitest's globals like `describe` and `it`
    environment: 'jsdom', // Simulates a browser environment for testing
    setupFiles: './test/setup.ts', // Optional: Path to setup file
    include: ['test/**/*.test.ts'], // Files to include in the test
      coverage: {
        reporter: ['text', 'json', 'html'], // Enable coverage reporting
      },
    },
    plugins: [vue()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'), // Ensure this alias exists
      },
    },
  },
);