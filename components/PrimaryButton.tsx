import React from 'react';
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
      className="btn-primary !flex !h-16 !items-center !justify-center active:scale-[0.99]"
    >
      {children}
    </Link>
  );
}
