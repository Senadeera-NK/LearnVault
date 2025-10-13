"use client"

import { ChakraProvider } from "@chakra-ui/react"
import { StackProvider } from "@stackframe/stack";
import { stackClientApp } from "@/stack/client";
import { TooltipProvider } from "@/components/ui/tooltip"; // Add this import

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider>
      <StackProvider app={stackClientApp}>
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </StackProvider>
    </ChakraProvider>
  )
}