"use client";

import { ReactNode } from "react";
import * as Chakra from "@chakra-ui/react";
import {AuthProvider} from "../components/AuthContext";
import { ThemeProvider, createTheme } from "@mui/material/styles";
const theme = createTheme(); // default MUI theme

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
    {/* Provide the default Chakra system so the provider has a valid `value` */}
    <Chakra.ChakraProvider value={Chakra.defaultSystem}>
      <AuthProvider>{children}</AuthProvider>
    </Chakra.ChakraProvider>
    </ThemeProvider>

  );
}
