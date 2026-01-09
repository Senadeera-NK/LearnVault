"use client";

import { ReactNode } from "react";
import Sidebar from "../components/Sidebar";
import {useAuth} from "../components/AuthContext";
import { usePathname } from "next/navigation";

export default function ClientLayout({ children }: { children: ReactNode }) {
  const {user} = useAuth();
  const pathname = usePathname();

  const ShowSideBar = user && pathname !== "/";
  return (
    <div style={{ display: "flex" }}>
      {ShowSideBar&&<Sidebar />}
      <main style={{ flex: 1, minHeight: "100vh", padding: ShowSideBar?"1rem":"0" }}>
        {children}
      </main>
    </div>
  );
}
