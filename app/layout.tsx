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
        {/* Subtle ambient glow — refined projector effect */}
        <div className="projector-light" />

        {/* Sidebar navigation */}
        <Header />

        {/* Main content */}
        <main>{children}</main>

        {/* Footer — slim Lumière branding only */}
        <footer className="palace-footer">
          <div className="palace-footer__inner">
            <p className="palace-footer__text">
              <span className="palace-footer__logo">✦ LUMIÈRE ✦</span>
              <span className="palace-footer__sub">
                Established MCMLI · Cinema &amp; Television
              </span>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
