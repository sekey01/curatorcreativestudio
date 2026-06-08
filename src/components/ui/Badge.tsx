import type { ReactNode } from 'react';

type BadgeVariant = 'default' | 'pending' | 'in_progress' | 'completed' | 'category';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const styles: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-600',
  pending: 'bg-amber-100 text-amber-700',
  in_progress: 'bg-blue-100 text-blue-700',
  completed: 'bg-emerald-100 text-emerald-700',
  category: 'bg-[#E8F5F0] text-[#1D9E75]',
};

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
