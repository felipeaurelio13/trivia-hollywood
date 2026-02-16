import Link from 'next/link';

interface PrimaryButtonProps {
  href: string;
  children: React.ReactNode;
  ariaLabel: string;
}

export function PrimaryButton({ href, children, ariaLabel }: PrimaryButtonProps) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className="flex h-16 items-center justify-center rounded-2xl border-2 border-cyan-300 bg-cyan-200 px-4 text-lg font-bold text-slate-950 shadow-sm transition hover:bg-cyan-100 active:scale-[0.99]"
    >
      {children}
    </Link>
  );
}
