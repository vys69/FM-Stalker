import React, { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import Confetti from 'react-confetti';

const Timer = () => {
  const [time, setTime] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
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
        const minutes = Math.floor(newTime / 60000);
        
        // Check for 1 minute milestone
        if (minutes === 1 && lastMilestone.current === 0) {
          console.log("Milestone reached: 1 minute");
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 5000);
          lastMilestone.current = 1;
        }
        // Check for doubling milestones
        else if (minutes > 1 && minutes === lastMilestone.current * 2) {
          console.log(`Milestone reached: ${minutes} minutes`);
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 5000);
          lastMilestone.current = minutes;
        }
        
        return newTime;
      });
    }, 10);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const milliseconds = time % 1000;

    return `You've been stalking me for ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
  };

  return (
    <Draggable bounds="parent" handle=".title-bar">
      <div 
        ref={timerRef}
        className="window" 
        style={{ 
          width: '200px', 
          position: 'absolute', 
          top: '50px', 
          right: '50px',
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
            {formatTime(time)}
          </p>
        </div>
      </div>
    </Draggable>
  );
};

export default Timer;