import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  glow?: boolean;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  hoverEffect = false,
  glow = false,
  onClick,
}) => {
  const baseClass = hoverEffect ? 'glass-panel-interactive' : 'glass-panel';
  
  const glowClass = glow
    ? 'relative before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-[var(--primary-base)]/5 before:to-[var(--secondary-base)]/5 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500 before:-z-10'
    : '';

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl p-6 border border-[var(--border-premium)] ${baseClass} ${glowClass} ${className} ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      {/* Decorative inner glow reflection */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
      {children}
    </div>
  );
};
export default GlassCard;
