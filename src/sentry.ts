import * as Sentry from "@sentry/node";
// import * as Tracing from "@sentry/tracing";

Sentry.init({
  dsn:
    "https://b0c46288ae3e4233ae2c5277e34aa4fa@o544584.ingest.sentry.io/5666001",

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
});

// const transaction = Sentry.startTransaction({
//   op: "test",
//   name: "My First Test Transaction",
// });

// setTimeout(() => {
//   try {
//     throw new Error("leizl test");
//   } catch (e) {
//     console.log('captureException')
//     Sentry.captureException(e);
//   } finally {
//     transaction.finish();
//   }
// }, 99);

