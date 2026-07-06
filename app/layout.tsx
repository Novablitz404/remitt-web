import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Remitt — Your dollar account. Anywhere on earth.",
  description:
    "Send, receive, and save US dollars instantly. No bank required. Powered by USDC on Stellar.",
};

// TEMPORARY holding-page layout while the site is rebuilt: no header/nav —
// the page is a single full-screen section. The full layout (header, nav,
// CTA) is preserved in layout-full.tsx.bak; restore from there.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable}`}>
      <body className="min-h-screen bg-cream font-sans text-ink antialiased">
        <main>{children}</main>
      </body>
    </html>
  );
}
