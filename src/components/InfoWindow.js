import React from 'react';
import Draggable from 'react-draggable';
import { motion } from 'framer-motion';

const InfoWindow = ({ onClose }) => {
  return (
    <Draggable handle=".title-bar">
      <motion.div 
        className="window" 
        style={{ position: 'absolute', bottom: '40px', right: '10px', width: '250px' }}
        initial={{ opacity: 0, y: 50, scale: 0.3 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      >
        <div className="title-bar">
          <div className="title-bar-text">Info</div>
          <div className="title-bar-controls">
            <button aria-label="Close" onClick={onClose}></button>
          </div>
        </div>
        <div className="window-body">
          <p>Created by grim</p>
          <p>
            <a href="https://github.com/vys69/FM-Stalker" target="_blank" rel="noopener noreferrer">GitHub</a>
          </p>
          <p>
            <a href="https://twitter.com/fuckgrimlabs" target="_blank" rel="noopener noreferrer">Twitter</a>
          </p>
        </div>
      </motion.div>
    </Draggable>
  );
};

export default InfoWindow;