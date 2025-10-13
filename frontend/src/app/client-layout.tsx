"use client";

import { useEffect } from "react";
import { useDisclosure } from "@chakra-ui/react";
import Sidebar from "@/components/Sidebar";
import { AuthProvider } from "@/components/AuthContext";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Sidebar />
      <main style={{ padding: "1rem" }}>
        {children}
      </main>
    </AuthProvider>
  );
}