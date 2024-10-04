import React, { useState, useCallback, useRef } from 'react';
import { useHover } from '../hooks/useHover';

const TrackItem = ({ track, index }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const trackNameRef = useRef(null);
  const [hoverRef, isHovering] = useHover();

  const handleMouseMove = useCallback((event) => {
    if (trackNameRef.current) {
      const rect = trackNameRef.current.getBoundingClientRect();
      setMousePosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      });
    }
  }, []);

  return (
    <li className="track-item" data-index={index}>
      <span 
        ref={(el) => {
          trackNameRef.current = el;
          hoverRef.current = el;
        }}
        className="track-name"
        onMouseMove={handleMouseMove}
      >
        {track.name}
      </span>
      {" - "}{track.artist['#text']}
      {isHovering && track.image && track.image.length > 0 && (
        <img 
          src={track.image[2]['#text']} 
          alt={`${track.name} cover`} 
          className="track-cover"
          style={{
            left: `${mousePosition.x}px`,
            top: `${mousePosition.y}px`
          }}
        />
      )}
    </li>
  );
};

export default TrackItem;