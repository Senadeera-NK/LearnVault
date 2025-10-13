import { StackClientApp } from "@stackframe/stack";

export const stackClientApp = new StackClientApp({
  tokenStore: "memory", // Change to localStorage
  projectId: process.env.NEXT_PUBLIC_STACK_PROJECT_ID!,
  publishableClientKey: process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY!,
urls: {
  home: "https://bookish-space-spoon-q69vx4j4qr42696p-3000.app.github.dev",
  afterSignIn: "https://bookish-space-spoon-q69vx4j4qr42696p-3000.app.github.dev/dashboard",
  afterSignUp: "https://bookish-space-spoon-q69vx4j4qr42696p-3000.app.github.dev/dashboard",
  signIn: "https://bookish-space-spoon-q69vx4j4qr42696p-3000.app.github.dev/handler/signin",
},

});