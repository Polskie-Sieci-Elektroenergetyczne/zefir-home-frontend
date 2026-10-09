import { defineConfig } from 'orval';

const apiUrl = process.env.API_URL?.trim();

if (!apiUrl) {
  throw new Error('API_URL is missing. Set it to the OpenAPI specification URL.');
}

export default defineConfig({
  zefir: {
    output: {
      workspace: './src/api',
      target: './zefir.ts',
      schemas: './model',
      mode: 'tags-split',
      client: 'swr',
      httpClient: 'fetch',
      mock: true
    },
    input: {
      target: apiUrl
    }
  }
});
