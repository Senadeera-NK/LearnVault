// src/app/layout.tsx
import { Providers } from "./providers";
import Sidebar from "@/components/Sidebar";
import Googlesignin from "./googlesignin/page";
import { useSession } from "next-auth/react"
import Google from "next-auth/providers/google";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const {data: session} = useSession();
  return (
    <html lang="en">
      <body>
        <Providers>
          <Sidebar />
          <main style={{ padding: "1rem" }}>
            {!session && <Googlesignin />}
            {session &&(
              <div>
                <p>Logged in as: {session.user?.name}</p>
                <p>Email: {session.user?.email}</p>
                <Googlesignin />
              </div>
            )}
            {children}
            </main>
        </Providers>
      </body>
    </html>
  );
}