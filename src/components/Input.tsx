import React, { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1 w-full">
        <label className="text-sm text-customZinc-500 dark:text-customWhite-100 ml-1">{label}</label>
        <div className="relative">
          <input
            ref={ref}
            className={`w-full px-4 py-2 border border-customZinc-550 rounded-lg focus:outline-none focus:ring-2 focus:ring-bluet-500 transition-colors bg-white dark:bg-bluet-950 text-customZinc-500 dark:text-customWhite-100 ${error ? 'border-brandRed-500 focus:ring-brandRed-500' : 'border-gray-300 dark:border-gray-600'
              } ${className}`}
            {...props}
          />
          {icon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-customZinc-500 dark:text-gray-500">
              {icon}
            </div>
          )}
        </div>
        {error && <span className="text-xs text-brandRed ml-1">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
