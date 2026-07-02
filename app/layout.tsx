import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
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
  title: "Remitt — Send money to the Philippines",
  description: "Fast, low-fee USD to PHP transfers. No bank account needed.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable}`}>
      <body className="min-h-screen bg-slate-50 font-sans text-gray-900 antialiased">
        <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
          <div className="relative flex h-16 w-full items-center justify-between gap-3 px-6 sm:px-10 lg:px-20">
            <Link href="/" className="flex items-center" aria-label="Remitt home">
              <Image
                src="/remitt_blk_horizontal.png"
                alt="Remitt"
                width={220}
                height={50}
                priority
                className="h-11 w-auto"
              />
            </Link>

            <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
              {[
                ["Features", "/#features"],
                ["Why Remitt", "/#why-remitt"],
                ["FAQ", "/#faq"],
                ["Liquidity", "/merchants"],
              ].map(([label, href]) => (
                <Link
                  key={label}
                  href={href}
                  className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                >
                  {label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-1.5">
              <Link
                href="/merchants"
                className="hidden rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 sm:inline-flex"
              >
                Provide liquidity
              </Link>
              <Link
                href="/send"
                className="group inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm shadow-indigo-900/20 transition-colors hover:bg-indigo-500"
              >
                Send money
                <span className="transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </Link>
            </div>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
