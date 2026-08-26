import React from 'react';
import { motion } from 'framer-motion';

interface PageShellProps {
  children: React.ReactNode;
  className?: string;
}

export const PageShell: React.FC<PageShellProps> = ({ children, className }) => {
  return (
    <motion.main
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={`min-h-[calc(100vh-14rem)] py-8 sm:py-12 ${className || ''}`}
    >
      {children}
    </motion.main>
  );
};
