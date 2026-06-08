import { type TextareaHTMLAttributes, forwardRef } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const areaId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={areaId} className="text-sm font-medium text-[#374151]">
            {label}
          </label>
        )}
        <textarea
          id={areaId}
          ref={ref}
          rows={4}
          className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-[#111827] placeholder:text-[#9CA3AF] outline-none transition-all duration-200 focus:ring-2 focus:ring-[#1D9E75]/30 focus:border-[#1D9E75] resize-none ${
            error ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300'
          } ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';
