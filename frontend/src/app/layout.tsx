"use client";

import { Providers } from "./providers";
import Sidebar from "@/components/Sidebar";
import GoogleSignIn from "./googlesignin/page";
import { useState } from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ userName: string; userEmail: string } | null>(null);

  return (
    <html lang="en">
      <body>
        <Providers>
          <Sidebar />
          <main style={{ padding: "1rem" }}>
            {!user && (
              <GoogleSignIn
                onUser={(data: { userName: string; userEmail: string }) => setUser(data)}
              />
            )}

            {user && (
              <div>
                <p>Logged in as: {user.userName}</p>
                <p>Email: {user.userEmail}</p>
              </div>
            )}

            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}