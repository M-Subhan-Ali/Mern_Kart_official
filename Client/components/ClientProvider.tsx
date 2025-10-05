"use client";

import { CookiesProvider } from "react-cookie";
import { AppThemeProvider } from "@/theme/ThemeProvider";
import Navbar from "./Navbar";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CookiesProvider>
        <Navbar/>
      <AppThemeProvider>{children}</AppThemeProvider>
    </CookiesProvider>
  );
}
