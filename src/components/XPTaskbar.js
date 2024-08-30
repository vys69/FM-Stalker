import React, { useState, useEffect } from 'react';
import '../xp-taskbar.css';

const XPTaskbar = () => {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours() % 12 || 12;
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
      setCurrentTime(`${hours}:${minutes} ${ampm}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="xp-footer">
      <div className="xp-footer-inner">
        <div className="xp-footer-start">
          <button className="start-button">
            <img src="/winicon.png" alt="Start" width="25" height="25" />
            Start
          </button>
        </div>
        <div className="xp-footer-end">
          <div className="time-display">{currentTime}</div>
        </div>
      </div>
    </div>
  );
};

export default XPTaskbar;