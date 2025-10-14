import "server-only";
import { StackServerApp } from "@stackframe/stack";

export const stackServerApp = new StackServerApp({
  tokenStore: "nextjs-cookie",
  projectId: process.env.NEXT_PUBLIC_STACK_PROJECT_ID!,
  publishableClientKey: process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY!,
  secretServerKey: process.env.STACK_SECRET_SERVER_KEY!,
 urls: {
  home: "https://bookish-space-spoon-q69vx4j4qr42696p-3000.app.github.dev",
  afterSignIn: "https://bookish-space-spoon-q69vx4j4qr42696p-3000.app.github.dev/dashboard",
  afterSignUp: "https://bookish-space-spoon-q69vx4j4qr42696p-3000.app.github.dev/dashboard",
},

});