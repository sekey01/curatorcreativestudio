import type { ReactNode } from 'react';

type BadgeVariant = 'default' | 'pending' | 'in_progress' | 'completed' | 'category';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const variantStyle: React.CSSProperties =
    variant === 'pending'     ? { background: 'rgba(251,191,36,0.1)', color: 'rgb(251,191,36)',   border: '1px solid rgba(251,191,36,0.25)' } :
    variant === 'in_progress' ? { background: 'var(--accent-subtle)',  color: 'var(--text-1)',     border: '1px solid var(--border)' } :
    variant === 'completed'   ? { background: 'rgba(52,211,153,0.1)',  color: 'rgb(52,211,153)',   border: '1px solid rgba(52,211,153,0.25)' } :
    variant === 'category'    ? { background: 'var(--accent-subtle)',  color: 'var(--text-2)',     border: '1px solid var(--border)' } :
                                { background: 'var(--accent-subtle)',  color: 'var(--text-3)',     border: '1px solid var(--border)' };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide ${className}`}
      style={variantStyle}
    >
      {children}
    </span>
  );
}
