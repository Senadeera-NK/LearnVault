"use client";

import { ReactNode } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import {AuthProvider} from "../components/AuthContext";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ChakraProvider>
      <AuthProvider>{children}</AuthProvider>
    </ChakraProvider>
  );
}
