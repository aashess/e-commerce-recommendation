import { StackServerApp } from "@stackframe/js";
import { stackClientApp } from "./client.js";

export const stackServerApp = new StackServerApp({
  inheritsFrom: stackClientApp,
});
