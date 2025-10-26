import Providers from "./providers";
import ClientLayout from "./client-layout";
import { ThemeProvider, createTheme } from "@mui/material/styles";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <ClientLayout>{children}</ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
