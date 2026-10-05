import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// RTL auto-cleanup relies on globals, which are disable here
afterEach(() => {
  cleanup();
});
