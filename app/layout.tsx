import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Remitt — Send money to the Philippines",
  description: "Fast, low-fee USD to PHP transfers. No bank account needed.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
            <a href="/" className="text-xl font-bold text-indigo-600 tracking-tight">
              remitt
            </a>
            <nav className="flex gap-4 text-sm text-gray-600">
              <a href="/send" className="hover:text-gray-900">Send</a>
              <a href="/merchants" className="hover:text-gray-900">Liquidity providers</a>
            </nav>
          </div>
        </header>
        <main className="max-w-3xl mx-auto px-4 py-10">{children}</main>
      </body>
    </html>
  );
}
