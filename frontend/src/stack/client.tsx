import { StackClientApp } from "@stackframe/stack";

export const stackClientApp = new StackClientApp({
  tokenStore: "memory", // Change to localStorage
  projectId: process.env.NEXT_PUBLIC_STACK_PROJECT_ID!,
  publishableClientKey: process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY!,
urls: {
  home: "https://learnvault.loca.lt",
  afterSignIn: "https://learnvault.loca.lt/dashboard",
  afterSignUp: "https://learnvault.loca.lt/dashboard",
},

});