import type { UserConfig } from '@commitlint/types';

const config: UserConfig = {
  extends: ['@commitlint/config-conventional'],
  // Ignore dependabot commits
  ignores: [(message) => message.startsWith('chore: bump') || message.startsWith('Updating')]
};

export default config;
