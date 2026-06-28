import React from 'react';
import { motion } from 'framer-motion';

interface CustomButtonProps {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  disabled = false,
  icon,
  iconPosition = 'left',
  loading = false,
}) => {
  // Sizing definitions
  const sizeClasses = {
    sm: 'px-3.5 py-1.5 text-xs rounded-lg space-x-1.5',
    md: 'px-5 py-2.5 text-sm rounded-xl space-x-2',
    lg: 'px-7 py-3.5 text-base rounded-2xl space-x-2.5',
  };

  // Variant classes
  const variantClasses = {
    primary:
      'bg-gradient-to-r from-[var(--primary-base)] to-indigo-700 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/35 border border-indigo-600/10 hover:brightness-105 active:brightness-95',
    secondary:
      'bg-slate-900/5 hover:bg-slate-900/10 border border-slate-950/10 dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/10 text-slate-800 dark:text-slate-200 backdrop-blur-sm',
    accent:
      'bg-gradient-to-r from-[var(--secondary-base)] to-[var(--primary-base)] text-white shadow-md hover:brightness-105 active:brightness-95',
    outline:
      'border border-[var(--border-premium)] bg-transparent hover:bg-[var(--bg-surface-hover)] text-slate-800 dark:text-slate-200',
    ghost:
      'bg-transparent hover:bg-[var(--bg-surface-hover)] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white',
  };

  const isDisabled = disabled || loading;

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      whileHover={isDisabled ? {} : { scale: 1.02, y: -1 }}
      whileTap={isDisabled ? {} : { scale: 0.98, y: 0 }}
      className={`inline-flex items-center justify-center font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
        sizeClasses[size]
      } ${variantClasses[variant]} ${
        isDisabled ? 'opacity-50 cursor-not-allowed filter grayscale' : ''
      } ${className}`}
    >
      {loading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>
      )}

      <span>{children}</span>

      {!loading && icon && iconPosition === 'right' && (
        <span className="flex-shrink-0">{icon}</span>
      )}
    </motion.button>
  );
};
export default CustomButton;
