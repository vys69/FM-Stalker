import React, { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import Confetti from 'react-confetti';

const Timer = ({ position, onPositionChange }) => {
  const [time, setTime] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [bestTime, setBestTime] = useState(() => {
    const saved = localStorage.getItem('bestTime');
    return saved ? parseInt(saved, 10) : 0;
  });
  const lastMilestone = useRef(0);
  const timerRef = useRef(null);
  const [timerSize, setTimerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      if (timerRef.current) {
        setTimerSize({
          width: timerRef.current.offsetWidth,
          height: timerRef.current.offsetHeight
        });
      }
    };

    window.addEventListener('resize', updateSize);
    updateSize();

    // Trigger milestone at start
    console.log("Milestone reached: Timer started");
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);

    const interval = setInterval(() => {
      setTime(prevTime => {
        const newTime = prevTime + 10;
        const seconds = Math.floor(newTime / 1000);
        const minutes = Math.floor(seconds / 60);
        
        if (seconds <= 64) {
          // Check for second milestones
          if (seconds === 1 || (seconds > 1 && Math.log2(seconds) % 1 === 0)) {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 5000);
            lastMilestone.current = seconds;
          }
        } else {
          // Check for minute milestones
          if (minutes === 1 || (minutes > 1 && Math.log2(minutes) % 1 === 0 && minutes !== lastMilestone.current)) {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 5000);
            lastMilestone.current = minutes;
          }
        }
        
        return newTime;
      });
    }, 10);

    // Add event listener for page unload
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
      saveBestTime();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      saveBestTime();
    };
  }, []);

  useEffect(() => {
    saveBestTime();
  }, [time]);

  const saveBestTime = () => {
    if (time > bestTime) {
      localStorage.setItem('bestTime', time.toString());
      setBestTime(time);
    }
  };

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
    >
      <div 
        ref={timerRef}
        className="window" 
        style={{ 
          width: '200px', 
          position: 'absolute', 
        }}
      >
        {showConfetti && (
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
        <div className="title-bar">
          <div className="title-bar-text">Stalking Timer</div>
          <div className="title-bar-controls">
            <button aria-label="Minimize"></button>
            <button aria-label="Maximize"></button>
            <button aria-label="Close"></button>
          </div>
        </div>
        <div className="window-body">
          <p style={{ textAlign: 'center', fontSize: '1.2em' }}>
            You've been stalking me for {formatTime(time)}
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