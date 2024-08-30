import React from 'react';
import Draggable from 'react-draggable';

const InfoWindow = ({ onClose }) => {
  return (
    <Draggable handle=".title-bar">
      <div className="window" style={{ position: 'absolute', bottom: '40px', right: '10px', width: '250px' }}>
        <div className="title-bar">
          <div className="title-bar-text">Info</div>
          <div className="title-bar-controls">
            <button aria-label="Close" onClick={onClose}></button>
          </div>
        </div>
        <div className="window-body">
          <p>Created by grim</p>
          <p>
            <a href="https://github.com/vys69" target="_blank" rel="noopener noreferrer">GitHub</a>
          </p>
          <p>
            <a href="https://twitter.com/fuckgrimlabs" target="_blank" rel="noopener noreferrer">Twitter</a>
          </p>
        </div>
      </div>
    </Draggable>
  );
};

export default InfoWindow;