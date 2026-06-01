import type { Metadata } from "next";
import Header from "@/components/Header";
import ThemeScript from "@/components/ThemeScript";
import { Cinzel, Playfair_Display } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lumière — Cinema & Television",
  description:
    "Your premier destination for discovering the finest films and television programmes. Step inside Lumière.",
};

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  variable: "--font-heading",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
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

      <body className={`${cinzel.variable} ${playfair.variable} app-shell`}>
        {/* Ambient projector glow */}
        <div className="projector-light" />

        {/* Sidebar navigation */}
        <Header />

        {/* Main content */}
        <main>{children}</main>

        {/* Footer */}
        <footer className="palace-footer">
          <div className="palace-footer__inner">
            <div className="palace-footer__bulbs" aria-hidden="true">
              {Array.from({ length: 20 }).map((_, i) => (
                <span key={i} className={`footer-bulb footer-bulb-${(i % 4) + 1}`} />
              ))}
            </div>
            <p className="palace-footer__text">
              <span className="palace-footer__logo">✦ &nbsp; LUMIÈRE &nbsp; ✦</span>
              <span className="palace-footer__sub">
                Established MCMLI · Cinema &amp; Television Emporium
              </span>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}