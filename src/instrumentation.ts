import { Env } from "@/lib/env";
import * as Sentry from "@sentry/nextjs";

const sentryOptions: Sentry.NodeOptions | Sentry.EdgeOptions = {
  // Sentry DSN
  dsn: Env.NEXT_PUBLIC_SENTRY_DSN,

  // Enable Spotlight in development
  spotlight: Env.NODE_ENV === "development",

  // Adds request headers and IP for users, for more info visit
  sendDefaultPii: true,

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
};

export async function register() {
  if (!Env.NEXT_PUBLIC_SENTRY_DISABLED) {
    if (Env.NEXT_RUNTIME === "nodejs") {
      // Node.js Sentry configuration
      Sentry.init(sentryOptions);
    }

    if (Env.NEXT_RUNTIME === "edge") {
      // Edge Sentry configuration
      Sentry.init(sentryOptions);
    }
  }
}

export const onRequestError = Sentry.captureRequestError;
