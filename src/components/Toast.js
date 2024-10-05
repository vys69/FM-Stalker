import React from 'react';
import { motion } from 'framer-motion';

const Toast = ({ message, type, onClose, id, index }) => {
  const getTitle = () => {
    switch (type) {
      case 'info':
        return '🤓☝️';
      case 'warning':
        return '🤓☝️ whoa buddy!';
      case 'error':
        return '🤓☝️ ERRR! watch it buster!';
      default:
        return '🤓☝️';
    }
  };

  return (
    <motion.div
      className={`window toast ${type}`}
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      style={{ marginBottom: '10px' }}
    >
      <div className="title-bar">
        <div className="title-bar-text">{getTitle()}</div>
        <div className="title-bar-controls">
          <button aria-label="Close" onClick={() => onClose(id)}></button>
        </div>
      </div>
      <div className="window-body">
        <p>{message}</p>
      </div>
    </motion.div>
  );
};

export default Toast;