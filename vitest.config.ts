import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: { tsconfigPaths: true },
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      include: ['src/**/*.{js,jsx,ts,tsx}'],
      exclude: ['src/api/**', 'src/test/**', 'src/**/*.stories.{js,jsx,ts,tsx}']
    },
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          include: ['src/**/*.test.{ts,tsx}'],
          exclude: ['src/hooks/**/*.test.ts', 'src/**/*.int.test.{ts,tsx}']
        }
      },
      {
        extends: true,
        test: {
          name: 'integration',
          include: ['src/**/*.int.test.{ts,tsx}'],
          testTimeout: 5_000
        }
      }
    ],
  },
});
