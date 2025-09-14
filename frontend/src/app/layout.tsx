import { Providers } from "./providers" // for Chakra setup
import Sidebar from "@/components/Sidebar"

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
  )
}
