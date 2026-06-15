import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bolão Copa 2026",
  description: "Faça seus palpites para a Copa do Mundo 2026!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-slate-900 text-slate-100">
        <header className="bg-gradient-to-r from-green-800 to-green-600 shadow-lg">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <span className="text-2xl">⚽</span>
              <span className="text-xl font-bold text-white">
                Bolão Copa 2026
              </span>
            </a>
            <nav className="flex gap-4 text-sm">
              <a
                href="/resultados"
                className="text-green-100 hover:text-white transition-colors"
              >
                Resultados
              </a>
              <a
                href="/admin"
                className="text-green-100 hover:text-white transition-colors"
              >
                Admin
              </a>
            </nav>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
        <footer className="text-center py-6 text-slate-500 text-sm">
          Copa do Mundo 2026 — USA · Canada · México
        </footer>
      </body>
    </html>
  );
}
