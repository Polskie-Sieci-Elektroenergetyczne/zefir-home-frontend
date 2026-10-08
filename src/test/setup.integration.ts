import { afterAll, afterEach, beforeAll } from 'vitest';
import { server } from '@/test/msw/server';

const nodeFetch = globalThis.fetch;
globalThis.fetch = (input, init) =>
  typeof input === 'string' && input.startsWith('/')
    ? nodeFetch(new URL(input, 'http://localhost'), init)
    : nodeFetch(input, init);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
