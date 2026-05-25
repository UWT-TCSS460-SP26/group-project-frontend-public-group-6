import type { Metadata } from "next";
import Header from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Media Browse",
  description: "Sprint 6 Consumer App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="app-shell">
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
