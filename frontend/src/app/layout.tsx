// src/app/layout.tsx
"use client";

import { Providers } from "./providers";
import Sidebar from "@/components/Sidebar";
import AuthModal from "@/components/AuthModal";
import { useEffect } from "react";
import { useDisclosure } from "@chakra-ui/react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const timer = setTimeout(() => {
      onOpen();
    }, 5000);

    return () => clearTimeout(timer); // ✅ cleanup inside effect
  }, [onOpen]);

  return (
    <html lang="en">
      <body>
        <Providers>
          <Sidebar />
          <main style={{ padding: "1rem" }}>
            {children}
          </main>
        {/* Modal gets triggered after 5s */}
        <AuthModal isOpen={isOpen} onClose={onClose} />
        </Providers>
      </body>
    </html>
  );
}