import React from 'react';
import { motion } from 'framer-motion';

export const BackgroundBlobs: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
      {/* Aurora Radial Base */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,var(--primary-base),transparent_45%)] opacity-8 dark:opacity-15" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,var(--secondary-base),transparent_35%)] opacity-5 dark:opacity-10" />

      {/* Floating Blob 1 - Primary (Indigo) */}
      <motion.div
        className="absolute -top-[10%] -left-[10%] w-[60vw] h-[60vw] max-w-[600px] rounded-full bg-[var(--primary-base)] opacity-15 dark:opacity-10 blur-[100px]"
        animate={{
          x: [0, 50, -30, 0],
          y: [0, -60, 40, 0],
          scale: [1, 1.12, 0.92, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Floating Blob 2 - Secondary (Cyan) */}
      <motion.div
        className="absolute bottom-[10%] -right-[5%] w-[50vw] h-[50vw] max-w-[500px] rounded-full bg-[var(--secondary-base)] opacity-15 dark:opacity-10 blur-[120px]"
        animate={{
          x: [0, -70, 50, 0],
          y: [0, 60, -40, 0],
          scale: [1, 0.9, 1.15, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Floating Blob 3 - Accent (Emerald) */}
      <motion.div
        className="absolute top-[35%] left-[25%] w-[40vw] h-[40vw] max-w-[400px] rounded-full bg-[var(--accent-base)] opacity-10 dark:opacity-6 blur-[100px]"
        animate={{
          x: [0, 40, -40, 0],
          y: [0, -50, 50, 0],
          scale: [1, 1.05, 0.95, 1],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
};
export default BackgroundBlobs;
