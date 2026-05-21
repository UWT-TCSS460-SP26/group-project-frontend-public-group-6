import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Group 6 - TCSS 460",
  description: "Client-Server group project frontend",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
