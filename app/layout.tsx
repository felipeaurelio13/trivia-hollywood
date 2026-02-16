import type { Metadata } from 'next';
import './globals.css';
import { APP_VERSION } from '@/lib/version';

export const metadata: Metadata = {
  title: 'Trivia Hollywood',
  description: 'Trivia mobile-first de películas de Hollywood nominadas al Oscar.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <a
          href="#contenido-principal"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-cyan-200 focus:px-4 focus:py-2 focus:text-base focus:font-semibold focus:text-slate-950"
        >
          Saltar al contenido principal
        </a>
        <main
          id="contenido-principal"
          className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-4 pb-24 pt-4"
        >
          {children}
        </main>
        <footer className="fixed inset-x-0 bottom-0 border-t-2 border-slate-700 bg-slate-950 px-4 py-3 text-center text-sm text-slate-200">
          Trivia Hollywood · {APP_VERSION}
        </footer>
      </body>
    </html>
  );
}
