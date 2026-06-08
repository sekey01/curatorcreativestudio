import { type InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-[#374151]">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-[#111827] placeholder:text-[#9CA3AF] outline-none transition-all duration-200 focus:ring-2 focus:ring-[#1D9E75]/30 focus:border-[#1D9E75] ${
            error ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300'
          } ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';
