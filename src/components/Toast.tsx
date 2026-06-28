import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  onClose: (id: string) => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  id,
  message,
  type,
  onClose,
  duration = 5000,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />,
    error: <AlertTriangle className="w-5 h-5 text-rose-500 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-indigo-400 flex-shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-500/20 dark:border-emerald-500/10 shadow-emerald-500/5',
    error: 'border-rose-500/20 dark:border-rose-500/10 shadow-rose-500/5',
    info: 'border-indigo-500/20 dark:border-indigo-500/10 shadow-indigo-500/5',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 15, scale: 0.95 }}
      transition={{ type: 'spring', damping: 25, stiffness: 350 }}
      layout
      className={`flex items-center justify-between p-4 rounded-xl border glass-panel shadow-lg w-full max-w-sm gap-3 ${borders[type]}`}
    >
      <div className="flex items-center space-x-3">
        {icons[type]}
        <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
          {message}
        </span>
      </div>
      
      <button
        onClick={() => onClose(id)}
        className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};
export default Toast;
