"use client";

import { ReactNode } from "react";
import Sidebar from "../components/Sidebar";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <main style={{ flex: 1, minHeight: "100vh", padding: "1rem" }}>
        {children}
      </main>
    </div>
  );
}
