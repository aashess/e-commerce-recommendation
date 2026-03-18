import { StackClientApp } from "@stackframe/js";

export const stackClientApp = new StackClientApp({
  projectId: process.env.STACK_PROJECT_ID,
  publishableClientKey: process.env.STACK_PUBLISHABLE_CLIENT_KEY,
  tokenStore: "cookie",
});
