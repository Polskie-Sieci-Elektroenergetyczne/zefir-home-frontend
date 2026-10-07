import react from '@vitejs/plugin-react';
import { loadEnv } from 'vite';
import { ConfigEnv, defineConfig } from 'vitest/config';

export default defineConfig(({ mode }: ConfigEnv) => ({
  plugins: [react()],
  resolve: { tsconfigPaths: true },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    env: loadEnv(mode, process.cwd(), ''),
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
          setupFiles: ['./src/test/setup.integration.ts'],
          testTimeout: 5_000
        }
      }
    ]
  }
}));
