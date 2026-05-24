import type { Metadata } from "next";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "MovieBrowse",
  description: "Sprint 6 Consumer App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif" }}>
        <Header />
        <main style={{ padding: "24px" }}>{children}</main>
      </body>
    </html>
  );
}