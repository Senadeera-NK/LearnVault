import "server-only";
import { StackServerApp } from "@stackframe/stack";

export const stackServerApp = new StackServerApp({
  tokenStore: "nextjs-cookie",
  projectId: process.env.NEXT_PUBLIC_STACK_PROJECT_ID!,
  publishableClientKey: process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY!,
  secretServerKey: process.env.STACK_SECRET_SERVER_KEY!,
 urls: {
  home: "https://learnvault.loca.lt",
  afterSignIn: "https://learnvault.loca.lt/dashboard",
  afterSignUp: "https://learnvault.loca.lt/dashboard",
},

});