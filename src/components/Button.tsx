import React from 'react';
import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  isLoading,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyle = "w-full py-2.5 px-4 rounded-full font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 flex justify-center items-center";

  const variants = {
    primary: "bg-bluet-500 hover:bg-bluet-600 text-white focus:ring-bluet-500 dark:bg-bluet-600 dark:hover:bg-bluet-700",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100"
  };

  const currentVariant = variants[variant];
  const disabledStyle = (disabled || isLoading) ? "opacity-70 cursor-not-allowed" : "";

  return (
    <button
      className={`${baseStyle} ${currentVariant} ${disabledStyle} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
      ) : (
        children
      )}
    </button>
  );
};
