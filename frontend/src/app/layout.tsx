// src/app/layout.tsx
import { Providers } from "./providers";
import Sidebar from "@/components/Sidebar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Sidebar />
          <main style={{ padding: "1rem" }}>{children}</main>
        </Providers>
      </body>
    </html>
  );
}