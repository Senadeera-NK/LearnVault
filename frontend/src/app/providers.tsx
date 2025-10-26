"use client";

import { ReactNode } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import {AuthProvider} from "../components/AuthContext";
import { ThemeProvider, createTheme } from "@mui/material/styles";
const theme = createTheme(); // default MUI theme

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
    <ChakraProvider>
      <AuthProvider>{children}</AuthProvider>
    </ChakraProvider>
    </ThemeProvider>

  );
}
