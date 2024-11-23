import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [],
  test: {
    include: ['src/**/*.test.ts'],
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/testSetup.ts',
    mockReset: true,
    coverage: {
      provider: 'istanbul',
      include: ['src/**/*.ts'],
    },
  },
});
