import React, { useState, useEffect } from 'react';
import InfoWindow from './InfoWindow';

const XPTaskbar = () => {
  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const toggleInfoWindow = () => {
    setShowInfoWindow(!showInfoWindow);
  };

  return (
    <div className="xp-footer">
      <div className="xp-footer-inner">
        <div className="xp-footer-start">
          <button className="start-button">
            <img src="/winicon.png" alt="Windows Logo" />
            Start
          </button>
        </div>
        <div className="xp-footer-end">
        <button onClick={toggleInfoWindow} className="lastfm-stalker-button">
            <img src="/icons/question.png" alt="Info" />
          </button>
          <div className="time-display">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
      {showInfoWindow && <InfoWindow onClose={toggleInfoWindow} />}
    </div>
  );
};

export default XPTaskbar;