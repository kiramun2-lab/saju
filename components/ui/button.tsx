import { ButtonHTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';

type ButtonVariant = 'primary' | 'outline' | 'ghost';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
  fullWidth?: boolean;
};

export function Button({
  children,
  variant = 'primary',
  fullWidth,
  className,
  ...rest
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.99]';

  const variants: Record<ButtonVariant, string> = {
    primary:
      'bg-white/8 text-foreground shadow-card-soft hover:bg-white/12 border border-white/10',
    outline:
      'border border-white/14 bg-transparent text-foreground/85 hover:bg-white/6',
    ghost: 'bg-transparent text-foreground/80 hover:bg-white/5'
  };

  return (
    <button
      className={clsx(base, variants[variant], fullWidth && 'w-full', className)}
      {...rest}
    >
      {children}
    </button>
  );
}

