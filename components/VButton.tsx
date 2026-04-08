'use client';

import Link from 'next/link';
import { type ReactNode } from 'react';

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */
type VButtonVariant = 'primary' | 'secondary' | 'outline';
type VButtonSize    = 'sm' | 'md' | 'lg';

interface VButtonProps {
  href?: string;
  onClick?: () => void;
  variant?: VButtonVariant;
  size?: VButtonSize;
  className?: string;
  children: ReactNode;
  external?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

/* ------------------------------------------------------------------ */
/*  Styles — exactly matching the original btn-* classes               */
/* ------------------------------------------------------------------ */

/**
 * Primary: amber fill, no border.
 * Hover → white bg + navy text. No border appears on hover either.
 */
const PRIMARY =
  'inline-flex items-center justify-center gap-2 ' +
  'font-extrabold text-[0.875rem] rounded-[10px] ' +
  'bg-[#f59e0b] text-[#001f3f] border-0 ' +
  'shadow-[0_4px_15px_rgba(245,158,11,0.25)] ' +
  'transition-all duration-250 whitespace-nowrap cursor-pointer ' +
  'hover:bg-white hover:text-[#001f3f] hover:-translate-y-[2px] ' +
  'hover:shadow-[0_10px_30px_rgba(255,255,255,0.2)] ' +
  'active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60';

/**
 * Secondary: transparent, white border.
 * Hover → white bg + navy text.
 */
const SECONDARY =
  'inline-flex items-center justify-center gap-2 ' +
  'font-bold text-[0.875rem] rounded-[10px] ' +
  'bg-transparent text-white border-2 border-white/25 ' +
  'transition-all duration-250 whitespace-nowrap cursor-pointer ' +
  'hover:bg-white hover:text-[#001f3f] hover:border-white hover:-translate-y-[2px] ' +
  'active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60';

/**
 * Outline: transparent, navy border (for light backgrounds).
 * Hover → white bg + navy text.
 */
const OUTLINE =
  'inline-flex items-center justify-center gap-2 ' +
  'font-bold text-[0.875rem] rounded-[10px] ' +
  'bg-transparent text-[#001f3f] border-2 border-[#e2e8f0] ' +
  'transition-all duration-250 whitespace-nowrap cursor-pointer ' +
  'hover:bg-white hover:text-[#001f3f] hover:border-[#001f3f] hover:-translate-y-[2px] ' +
  'hover:shadow-[0_8px_20px_rgba(255,255,255,0.15)] ' +
  'active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#001f3f]/40';

const VARIANT_CLASSES: Record<VButtonVariant, string> = {
  primary: PRIMARY,
  secondary: SECONDARY,
  outline: OUTLINE,
};

const SIZES: Record<VButtonSize, string> = {
  sm:  'text-[0.8125rem] px-5 py-2',
  md:  'text-sm sm:text-base px-7 py-3.5 sm:px-8 sm:py-4',
  lg:  'text-base sm:text-lg px-9 py-4 sm:px-10 sm:py-5',
};

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */
export default function VButton({
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  external = false,
  disabled = false,
  type = 'button',
}: VButtonProps) {
  const classes = [VARIANT_CLASSES[variant], SIZES[size], className]
    .filter(Boolean)
    .join(' ');

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {children}
    </button>
  );
}
