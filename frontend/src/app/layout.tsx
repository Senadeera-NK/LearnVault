// src/app/layout.tsx
import { Providers } from "./providers";
import Sidebar from "@/components/Sidebar";
import Googlesignin from "./googlesignin/page";
import { useSession } from "next-auth/react"
import Google from "next-auth/providers/google";
import AuthModal from "@/components/AuthModal";
import { useEffect } from "react";
import { useDisclosure } from "@chakra-ui/react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const {isOpen, onOpen, onClose} = useDisclosure();
  useEffect(() => {
    const timer = setTimeout(() => {
      onOpen();
  }, 5000);

  return () => clearTimeout(timer);
  }, [onOpen]);

  return (
    <html lang="en">
      <body>
        <Providers>
          <Sidebar />
          <main style={{ padding: "1rem" }}>
            {children}
            </main>
        </Providers>
        <AuthModal isOpen={isOpen} onClose={onClose}/>
      </body>
    </html>
  );
}