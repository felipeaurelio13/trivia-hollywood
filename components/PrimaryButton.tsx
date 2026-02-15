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
      className="flex h-14 items-center justify-center rounded-2xl bg-cyan-500 text-base font-semibold text-slate-950 transition active:scale-[0.99]"
    >
      {children}
    </Link>
  );
}
