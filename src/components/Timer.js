import React, { useState, useEffect, useRef, useCallback } from 'react';
import Draggable from 'react-draggable';
import Confetti from 'react-confetti';

const Timer = ({ position, onPositionChange, username, isListening }) => {
  const [time, setTime] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [bestTime, setBestTime] = useState(() => {
    const saved = localStorage.getItem('bestTime');
    return saved ? parseInt(saved, 10) : 0;
  });
  const hasStarted = useRef(false);
  const timerRef = useRef(null);
  const [timerSize, setTimerSize] = useState({ width: 0, height: 0 });
  const draggableRef = useRef(null);

  const saveBestTime = useCallback(() => {
    if (time > bestTime) {
      localStorage.setItem('bestTime', time.toString());
      setBestTime(time);
    }
  }, [time, bestTime]);

  useEffect(() => {
    let interval;
    if (isListening && !hasStarted.current) {
      hasStarted.current = true;
    }
    if (hasStarted.current) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 10);
      }, 10);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isListening]);

  useEffect(() => {
    saveBestTime();
  }, [saveBestTime]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const milliseconds = time % 1000;

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
  };

  return (
    <Draggable 
      bounds="parent" 
      handle=".title-bar"
      position={position}
      onStop={(e, data) => onPositionChange(data.x, data.y)}
      nodeRef={draggableRef}
    >
      <div 
        ref={draggableRef}
        className="window" 
        style={{ 
          width: '200px', 
          position: 'absolute', 
        }}
      >
        {showConfetti && timerRef.current && (
          <Confetti
            width={timerSize.width}
            height={window.innerHeight - timerRef.current.getBoundingClientRect().top}
            confettiSource={{x: timerSize.width / 2, y: 0}}
            recycle={false}
            numberOfPieces={100}
            gravity={0.1}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              pointerEvents: 'none'
            }}
          />
        )}
        <div className="title-bar" ref={timerRef}>
          <div className="title-bar-text">Stalking Timer</div>
          <div className="title-bar-controls">
            <button aria-label="Minimize"></button>
            <button aria-label="Maximize"></button>
            <button aria-label="Close"></button>
          </div>
        </div>
        <div className="window-body">
          <p style={{ textAlign: 'center', fontSize: '1.2em' }}>
            {!hasStarted.current ? (
              <img style={{ width: '100%', maxWidth: '300px' }} src={require('../output.gif')} alt="Loading..." />
            ) : (
              `You've been stalking ${username} for ${formatTime(time)}`
            )}
          </p>
          <p style={{ textAlign: 'center', fontSize: '0.9em' }}>
            Best time: {formatTime(bestTime)}
          </p>
        </div>
      </div>
    </Draggable>
  );
};

export default Timer;