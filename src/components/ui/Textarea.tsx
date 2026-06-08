import { type TextareaHTMLAttributes, forwardRef } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', id, style, ...props }, ref) => {
    const areaId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={areaId}
            className="text-xs font-medium uppercase tracking-widest"
            style={{ color: 'var(--text-3)' }}>
            {label}
          </label>
        )}
        <textarea
          id={areaId}
          ref={ref}
          rows={4}
          className={`w-full px-3.5 py-2.5 rounded-lg text-sm outline-none
            transition-all duration-200 resize-none ${className}`}
          style={{
            background: error ? 'rgba(239,68,68,0.06)' : 'var(--bg-input)',
            border: `1px solid ${error ? 'rgba(239,68,68,0.5)' : 'var(--border)'}`,
            color: 'var(--text-1)',
            ...style,
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-hover)';
            e.currentTarget.style.boxShadow = '0 0 0 3px var(--accent-subtle)';
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = error ? 'rgba(239,68,68,0.5)' : 'var(--border)';
            e.currentTarget.style.boxShadow = 'none';
            props.onBlur?.(e);
          }}
          {...props}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';
