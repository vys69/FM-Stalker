import React, { useState, useEffect } from 'react';

const NowPlaying = ({ currentTrack, username, error, onRefresh, isListening, isLoading }) => {
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setIsFading(false);
    }
  }, [isLoading]);

  useEffect(() => {
    // Set up an interval to refresh every minute (60000 milliseconds)
    const intervalId = setInterval(() => {
      onRefresh();
    }, 60000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [onRefresh]); // Add onRefresh to the dependency array

  const handleRefresh = () => {
    setIsFading(true);
    onRefresh();
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!isListening) {
    return (
      <div>
        <p>{username} isn't listening to music right now</p>
        <button onClick={onRefresh} disabled={isLoading}>Refresh</button>
      </div>
    );
  }

  const albumArt = currentTrack?.image && currentTrack.image.length > 2 ? currentTrack.image[2]['#text'] : null;

  return (
    <div className="now-playing">
      {!albumArt && (
        <div style={{ width: '100%', maxWidth: '300px' }}>
          <img style={{ width: '100%', maxWidth: '300px' }} src="https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png"></img>
        </div>
      )}
      {albumArt && (
        <img 
          src={albumArt || 'default-album-art.jpg'} 
          alt={`${currentTrack?.name || 'Unknown'} album art`} 
          className={`np-image ${isFading ? 'fading' : ''}`}
          style={{ width: '100%', maxWidth: '300px' }}
        />
      )}
      <p><strong>{currentTrack?.name || 'Unknown'}</strong></p>
      <p>{currentTrack?.artist['#text'] || 'Unknown Artist'}</p>
      <button onClick={handleRefresh} disabled={isLoading}>Refresh</button>
    </div>
  );
};

export default NowPlaying;