import styles from './FloatingActionButton.module.css';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { useHaptics } from '@/hooks/useHaptics';

export type TDirection = 'up' | 'down' | 'left' | 'right';

export interface IFABAction {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

interface IFABProps {
  radius?: number;
  /* Starting angle in radians (0 = right, Math.PI/2 = down) */
  startAngle?: number;
  arc?: number;
  actions: IFABAction[];
  fabIcon: React.ReactNode;
  label: string;
}

const FloatingActionButton = ({
  radius = 60,
  startAngle = Math.PI,
  arc = Math.PI / 2,
  actions,
  fabIcon,
  label,
}: IFABProps) => {
  const { selection } = useHaptics();
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    selection();
    setIsOpen((open) => !open);
  };

  const step = actions.length > 1 ? arc / (actions.length - 1) : 0;

  return (
    <div className={styles.container}>
      <AnimatePresence>
        {isOpen &&
          actions.map((action, index) => {
            const angle = startAngle + step * index;
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);

            return (
              <motion.button
                type='button'
                tabIndex={0}
                key={index}
                aria-label={action.label}
                title={action.label}
                onClick={() => {
                  selection();
                  action.onClick();
                }}
                className={styles.actionButton}
                initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  x,
                  y,
                }}
                exit={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                whileTap={{ scale: 0.95 }}
              >
                {action.icon}
              </motion.button>
            );
          })}
      </AnimatePresence>
      <motion.button
        type='button'
        tabIndex={0}
        aria-label={label}
        onClick={toggle}
        className={`${styles.fab} ${isOpen ? styles.fabOpen : ''}`}
        animate={{ rotate: isOpen ? 45 : 0 }}
        whileTap={{ scale: 0.95 }}
      >
        {fabIcon}
      </motion.button>
    </div>
  );
};

export default FloatingActionButton;
