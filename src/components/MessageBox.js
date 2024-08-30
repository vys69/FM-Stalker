import React from 'react';

const MessageBox = ({ message, onClose, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="message-box-overlay">
      <div className="window" style={{ width: '300px' }}>
        <div className="title-bar">
          <div className="title-bar-text">Message</div>
          <div className="title-bar-controls">
            <button aria-label="Close" onClick={onClose}></button>
          </div>
        </div>
        <div className="window-body">
          <p>{message}</p>
          <div className="field-row" style={{ justifyContent: 'flex-end' }}>
            <button onClick={onClose}>OK</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBox;