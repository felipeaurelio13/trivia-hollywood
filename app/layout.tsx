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
        <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-4 pb-20 pt-4">{children}</main>
        <footer className="fixed inset-x-0 bottom-0 border-t border-slate-800 bg-slate-950/95 px-4 py-2 text-center text-xs text-slate-400 backdrop-blur">
          Trivia Hollywood · {APP_VERSION}
        </footer>
      </body>
    </html>
  );
}
