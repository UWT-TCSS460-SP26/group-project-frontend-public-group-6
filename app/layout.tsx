import type { Metadata } from "next";
import Header from "@/components/Header";
import ThemeScript from "@/components/ThemeScript";
import { Cinzel, Inter } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "Media Browse",
  description: "Sprint 6 Consumer App",
};

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-heading",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={`${cinzel.variable} ${inter.variable} app-shell`}>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
