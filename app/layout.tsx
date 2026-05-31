import type { Metadata } from "next";
import Header from "@/components/Header";
import ThemeScript from "@/components/ThemeScript";
import { Cinzel, Playfair_Display } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Grand Palace — Picture House & Television Emporium",
  description:
    "Your premier destination for discovering the finest films and television programmes. Step inside The Grand Palace.",
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
        <ThemeScript />

        {/* Projector beam */}
        <div className="projector-light" />

        {/* Floating popcorn */}
        <div className="popcorn popcorn-1">🍿</div>
        <div className="popcorn popcorn-2">🍿</div>
        <div className="popcorn popcorn-3">🍿</div>
        <div className="popcorn popcorn-4">🍿</div>
        <div className="popcorn popcorn-5">🍿</div>
        <div className="popcorn popcorn-6">🎟</div>
        <div className="popcorn popcorn-7">🎬</div>

        {/* Floating dust motes */}
        <div className="dust-layer">
          {Array.from({ length: 22 }).map((_, i) => (
            <span key={i} className={`dust dust-${i + 1}`} />
          ))}
        </div>

        {/* Film strip side rails */}
        <div className="film-rail film-rail--left" aria-hidden="true">
          {Array.from({ length: 30 }).map((_, i) => (
            <span key={i} className="film-hole" />
          ))}
        </div>
        <div className="film-rail film-rail--right" aria-hidden="true">
          {Array.from({ length: 30 }).map((_, i) => (
            <span key={i} className="film-hole" />
          ))}
        </div>

        {/* Film reel watermark */}
        <div className="film-watermark" />

        <Header />

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
              <span className="palace-footer__logo">✦ THE GRAND PALACE ✦</span>
              <span className="palace-footer__sub">
                Established MCMLI · Picture House &amp; Television Emporium
              </span>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
