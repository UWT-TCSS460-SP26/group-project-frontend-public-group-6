import type { Metadata } from "next";
import Header from "@/components/Header";
import ThemeScript from "@/components/ThemeScript";
import { Cinzel, Inter } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "Media Palace",
  description: "Classic movie palace experience for movies and television",
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
      <ThemeScript />

      {/* Projector beam */}
      <div className="projector-light" />

      {/* Floating popcorn */}
      <div className="popcorn popcorn-1">🍿</div>
      <div className="popcorn popcorn-2">🍿</div>
      <div className="popcorn popcorn-3">🍿</div>
      <div className="popcorn popcorn-4">🍿</div>
      <div className="popcorn popcorn-5">🍿</div>

      {/* Floating dust */}
      <div className="dust-layer">
        {Array.from({ length: 18 }).map((_, i) => (
          <span key={i} className={`dust dust-${i + 1}`} />
        ))}
      </div>

      {/* Film reel watermark */}
      <div className="film-watermark" />

      <Header />

      <main>{children}</main>
    </body>
    </html>
  );
}
