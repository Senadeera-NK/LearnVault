"use client"

import { ChakraProvider } from "@chakra-ui/react"
import {SessionProvider} from "next-auth/react"
import { StackClientApp, StackProvider } from "@stackframe/stack";

const tokenStore = {
  async getToken() { return null },
  async setToken(_token: string | null) { /* persist token */ },
  async clearToken() { /* remove token */ },
} as any;

const stackApp = new StackClientApp({
    projectId :'c3d6ff2a-ddf3-4ff3-9e0e-f4b7e79e77a9',
    tokenStore,
  });

export function Providers({ children }: { children: React.ReactNode }) {
  return (
      <ChakraProvider>
        <StackProvider app={stackApp}>
        {children}
        </StackProvider>
      </ChakraProvider>
  )
}
