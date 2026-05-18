import { motion } from 'framer-motion';
import React from 'react';
import useTheme from '../hooks/useTheme';
import './AnimatedCard.css';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  gradient?: string;
  delay?: number;
}

export const AnimatedCard = ({ 
  children, 
  className = '', 
  onClick,
  gradient,
  delay = 0
}: AnimatedCardProps) => {
  const theme = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, rotateX: 12 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.65, delay }}
      whileHover={{
        y: -10,
        rotateX: -6,
        boxShadow: `0 20px 60px ${theme.colors.primary1}40`
      }}
      onClick={onClick}
      className={`animated-card ${className}`}
      style={{
        perspective: '1200px',
        background: gradient || `linear-gradient(135deg, ${theme.colors.primary1} 0%, ${theme.colors.primary2} 100%)`
      }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;
