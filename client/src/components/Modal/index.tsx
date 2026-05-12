import styles from './Modal.module.css';

import { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { motion, Variants } from 'framer-motion';
import { X } from 'lucide-react';

interface IModalProps {
  isOpen: boolean;
  title?: string;
  children?: React.ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
}

const dropIn: Variants = {
  hidden: {
    y: '-100vh',
    opacity: 0,
  },
  visible: {
    y: '0',
    opacity: 1,
    transition: {
      duration: 0.1,
      type: 'spring',
      damping: 25,
      stiffness: 500,
    },
  },
  exit: {
    y: '100vh',
    opacity: 0,
  },
};

const Modal = ({
  isOpen,
  title,
  children,
  onConfirm,
  onCancel,
}: IModalProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel?.();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  if (!isOpen) return null;

  const handleOverlayClick = () => {
    onCancel?.();
  };

  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return ReactDOM.createPortal(
    <motion.div
      className={styles.overlay}
      onClick={handleOverlayClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className={styles.modal}
        onClick={handleModalClick}
        variants={dropIn}
        initial='hidden'
        animate='visible'
        exit='exit'
      >
        {onCancel && (
          <button
            type='button'
            className={styles.closeButton}
            onClick={() => {
              onCancel();
            }}
            aria-label='Close modal'
          >
            <X />
          </button>
        )}
        {title && <div className={styles.title}>{title}</div>}
        <div className={styles.content}>{children}</div>
        <div className={styles.actions}>
          {onCancel && (
            <button
              type='button'
              className={styles.cancelButton}
              onClick={() => {
                onCancel();
              }}
            >
              Cancel
            </button>
          )}
          {onConfirm && (
            <button
              type='button'
              className={styles.confirmButton}
              onClick={() => {
                onConfirm();
              }}
            >
              Confirm
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  );
};

export default Modal;
