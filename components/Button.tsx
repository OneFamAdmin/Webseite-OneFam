import clsx from 'clsx';
import type { ComponentProps } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';

const base =
  'inline-flex items-center justify-center gap-2 font-body font-medium ' +
  'transition-[transform,background-color,color,border-color] duration-[180ms] ease-out ' +
  'hover:scale-[1.02] cursor-pointer';

const variants: Record<Variant, string> = {
  primary: 'bg-gold text-bg hover:bg-gold-hover rounded-[4px] px-7 py-3.5 text-base',
  secondary:
    'bg-transparent text-primary border border-white/25 hover:border-white/40 rounded-[4px] px-7 py-3.5 text-base',
  ghost: 'bg-transparent text-gold hover:text-gold-hover px-0 py-0 text-base underline-offset-4 hover:underline',
};

type ButtonProps =
  | ({ as?: 'button'; variant?: Variant } & ComponentProps<'button'>)
  | ({ as: 'a'; variant?: Variant } & ComponentProps<'a'>);

export default function Button({ variant = 'primary', className, as = 'button', ...rest }: ButtonProps) {
  const cls = clsx(base, variants[variant], className);
  if (as === 'a') return <a className={cls} {...(rest as ComponentProps<'a'>)} />;
  return <button className={cls} {...(rest as ComponentProps<'button'>)} />;
}
