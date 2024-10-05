import React, { useState, useEffect } from 'react';
import loadingGif from '../output.gif';

const Grid = ({ username, isUserLoading }) => {
  const [loadedImageUrl, setLoadedImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFading, setIsFading] = useState(false);
  const placeholderImage = "https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png";

  useEffect(() => {
    if (!isLoading) {
      setIsFading(false);
    }
  }, [isLoading]);

  useEffect(() => {
    if (isUserLoading) {
      setError(null);
    }
  }, [isUserLoading]);

  const generateGrid = async () => {
    if (!username) {
      setError('Please enter a username first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsFading(true);

    const url = `https://songstitch.art/collage?username=${username}&method=album&period=7day&artist=true&album=true&playcount=false&rows=3&columns=3&webp=true&cacheid=${Date.now()}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch grid image');
      }
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setLoadedImageUrl(imageUrl);
    } catch (err) {
      console.error('Error fetching grid:', err);
      setError('Failed to generate grid. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageLoad = () => {
    setIsFading(false);
  };

  const clearGrid = () => {
    setLoadedImageUrl(null);
    setIsFading(true);
    setTimeout(() => setIsFading(false), 500); // Ensure fade effect is visible
  };

  return (
    <div className="grid-container">
      <p>Click the button below to generate a 3x3 grid of your recent listening history.</p>
      <div className="button-container" style={{ display: 'flex', flexDirection: 'row', gap: '5px' }}>
        <button onClick={generateGrid} className="generate-grid-btn" disabled={isLoading || isUserLoading}>
          {isLoading ? 'Generating...' : 'Generate Grid'}
        </button>
        <button onClick={clearGrid} className="clear-grid-btn" disabled={isLoading || isUserLoading || !loadedImageUrl}>
          Clear Grid
        </button>
      </div>
      <div className="generation-container">
        {error && <p className="error-message">{error}</p>}
        <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
          <img 
            src={loadedImageUrl || placeholderImage}
            alt={loadedImageUrl ? "Listening Grid" : "Placeholder"}
            className={`grid-image ${isFading ? 'fading' : ''}`}
            style={{ 
              width: '100%', 
              maxWidth: '300px',
            }}
            onLoad={handleImageLoad}
          />
          {loadedImageUrl && loadedImageUrl !== placeholderImage && (
            <img 
              src={loadedImageUrl}
              alt="Listening Grid"
              style={{ display: 'none' }}
              onLoad={handleImageLoad}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Grid;