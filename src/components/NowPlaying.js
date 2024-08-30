import React, { useState, memo } from 'react';

const NowPlaying = ({ currentTrack, error, onRefresh }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (!currentTrack) {
    return (
      <>
        <p>Click 'Refresh' to load your current track</p>
        <button onClick={onRefresh}>Refresh</button>
      </>
    );
  }

  return (
    <>
      <div className="image-container">
        {!isImageLoaded && <div className="loader"></div>}
        <img 
          src={currentTrack.image[2]['#text'] || 'https://via.placeholder.com/150'}
          alt={currentTrack.name}
          className={`album-image ${isImageLoaded ? 'loaded' : ''}`}
          draggable="false"
          onLoad={() => setIsImageLoaded(true)}
          onError={() => setIsImageLoaded(true)}
        />
      </div>
      <p><strong>{currentTrack.name}</strong></p>
      <p>Artist: {currentTrack.artist['#text']}</p>
      <p>Album: {currentTrack.album['#text']}</p>
      <button onClick={onRefresh}>Refresh</button>
    </>
  );
};

export default memo(NowPlaying);