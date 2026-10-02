import { defineConfig } from 'orval';

export default defineConfig({
  zefir: {
    output: {
      workspace: './src/api',
      target: './zefir.ts',
      schemas: './model',
      mode: 'tags-split',
      client: 'swr',
      mock: true
    },
    input: {
      target: process.env.API_URL || ''
    }
  }
});
