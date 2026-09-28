import { createEnv } from "@t3-oss/env-nextjs";
import * as z from "zod";

export const Env = createEnv({
  server: {
    BUILD_STANDALONE: z.enum(["true", "false"]),
    SENTRY_AUTH_TOKEN: z.string().min(1).startsWith("sntrys_"),
    NEXT_RUNTIME: z.enum(["nodejs", "edge"]),
  },
  client: {
    NEXT_PUBLIC_SENTRY_DSN: z.string(),
    NEXT_PUBLIC_SENTRY_ORG: z.string(),
    NEXT_PUBLIC_SENTRY_PROJECT: z.string(),
    NEXT_PUBLIC_SENTRY_DISABLED: z.enum(["true", "false"]),
    NEXT_PUBLIC_APP_URL: z.string(),
  },
  shared: {
    NODE_ENV: z.enum(["test", "development", "production"]).optional(),
  },
  runtimeEnv: {
    BUILD_STANDALONE: process.env.BUILD_STANDALONE,
    SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    NEXT_PUBLIC_SENTRY_ORG: process.env.NEXT_PUBLIC_SENTRY_ORG,
    NEXT_PUBLIC_SENTRY_PROJECT: process.env.NEXT_PUBLIC_SENTRY_PROJECT,
    NEXT_PUBLIC_SENTRY_DISABLED: process.env.NEXT_PUBLIC_SENTRY_DISABLED,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_RUNTIME: process.env.NEXT_RUNTIME,
  },
});
