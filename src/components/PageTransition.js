import React from 'react';
import { motion } from 'framer-motion';
import { getUserSettings } from '../services/storage';

const pageVariants = {
  initial: {
    opacity: 0,
    x: -20,
  },
  in: {
    opacity: 1,
    x: 0,
  },
  out: {
    opacity: 0,
    x: 20,
  },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5,
};

const PageTransition = ({ children }) => {
  const settings = getUserSettings();
  const animationSpeed = settings?.animationSpeed || 1;

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={{
        ...pageTransition,
        duration: pageTransition.duration / animationSpeed,
      }}
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition; 