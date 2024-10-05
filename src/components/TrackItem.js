import React, { useState, useCallback, useRef } from 'react';
import { useHover } from '../hooks/useHover';

const TrackItem = ({ track, index }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const trackItemRef = useRef(null);
  const [hoverRef, isHovering] = useHover();

  const handleMouseMove = useCallback((event) => {
    if (trackItemRef.current) {
      const rect = trackItemRef.current.getBoundingClientRect();
      setMousePosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      });
    }
  }, []);

  // Function to get the most appropriate image size
  const getOptimalImageUrl = (images) => {
    if (!images || images.length === 0) return null;
    
    // Find the smallest image that's at least 30x30
    // If none are big enough, use the largest available
    const optimalImage = images.reduce((best, current) => {
      const size = parseInt(current.size, 10) || 0;
      if (size >= 30 && (best.size < 30 || size < best.size)) {
        return { size, url: current['#text'] };
      }
      return best.size > size ? best : { size, url: current['#text'] };
    }, { size: 0, url: null });

    return optimalImage.url;
  };

  const imageUrl = getOptimalImageUrl(track.image);

  return (
    <li 
      className="track-item" 
      data-index={index}
      ref={(el) => {
        trackItemRef.current = el;
        hoverRef.current = el;
      }}
      onMouseMove={handleMouseMove}
    >
      <span className="track-name">{track.name}</span>
      {" - "}{track.artist['#text']}
      {isHovering && imageUrl && (
        <img 
          src={imageUrl}
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