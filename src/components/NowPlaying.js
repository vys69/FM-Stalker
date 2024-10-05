import React, { useState, useEffect } from 'react';
import { useToast } from '../contexts/ToastContext';

const NowPlaying = ({ currentTrack, username, error, onRefresh, isListening, isLoading }) => {
  const [isFading, setIsFading] = useState(false);
  const [loadedImageUrl, setLoadedImageUrl] = useState(null);
  const placeholderImage = "https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png";
  const { showToast } = useToast();

  useEffect(() => {
    if (!isLoading) {
      setIsFading(false);
    }
  }, [isLoading]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      handleRefresh();
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  const handleRefresh = async () => {
    setIsFading(true);
    try {
      await onRefresh();
      showToast('Music refreshed successfully!', 'info');
    } catch (error) {
      console.error('Error refreshing music:', error);
      showToast('Failed to refresh music. Please try again.', 'error');
    }
  };

  const handleImageLoad = (loadedUrl) => {
    setLoadedImageUrl(loadedUrl);
    setIsFading(false);
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
      <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
        <img 
          src={loadedImageUrl || placeholderImage}
          alt={loadedImageUrl ? `${currentTrack?.name || 'Unknown'} album art` : "Placeholder"}
          className={`np-image ${isFading ? 'fading' : ''}`}
          style={{ 
            width: '100%', 
            maxWidth: '300px',
          }}
        />
        {albumArt && albumArt !== loadedImageUrl && (
          <img 
            src={albumArt}
            alt={`${currentTrack?.name || 'Unknown'} album art`}
            style={{ display: 'none' }}
            onLoad={() => handleImageLoad(albumArt)}
          />
        )}
      </div>
      <p><strong>{currentTrack?.name || 'Unknown'}</strong></p>
      <p>{currentTrack?.artist['#text'] || 'Unknown Artist'}</p>
      <button onClick={handleRefresh} disabled={isLoading}>Refresh</button>
    </div>
  );
};

export default NowPlaying;