import * as Sentry from "@sentry/node";
// import * as Tracing from "@sentry/tracing";
import { RewriteFrames } from "@sentry/integrations";

Sentry.init({
  dsn:
    "https://b0c46288ae3e4233ae2c5277e34aa4fa@o544584.ingest.sentry.io/5666001",

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    new RewriteFrames(),
  ],
  release: process.env.RELEASE,
  tracesSampleRate: 1.0,
});


