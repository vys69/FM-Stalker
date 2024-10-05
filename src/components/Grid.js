import React, { useState, useEffect } from 'react';
import loadingGif from '../output.gif';

const Grid = ({ username, isUserLoading }) => {
  const [gridImage, setGridImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (!isLoading && isFading) {
      setIsFading(false);
    }
  }, [isLoading, isFading]);

  useEffect(() => {
    if (isUserLoading) {
      setGridImage(null);
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
    if (gridImage) {
      setIsFading(true);
    }

    const url = `https://songstitch.art/collage?username=${username}&method=album&period=7day&artist=true&album=true&playcount=false&rows=3&columns=3&webp=true&cacheid=${Date.now()}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch grid image');
      }
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setGridImage(imageUrl);
    } catch (err) {
      console.error('Error fetching grid:', err);
      setError('Failed to generate grid. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid-container">
      <p>Click the button below to generate a 3x3 grid of your recent listening history.</p>
      <button onClick={generateGrid} className="generate-grid-btn" disabled={isLoading || isUserLoading}>
        {isLoading ? 'Generating...' : 'Generate Grid'}
      </button>
      <div className="generation-container">
        {error && <p className="error-message">{error}</p>}
        {!gridImage && !isLoading && (
          <div style={{ width: '100%', maxWidth: '300px' }}>
            <img style={{ width: '100%', maxWidth: '300px' }} src="https://lastfm.freetls.fastly.net/i/u/174s/2a96cbd8b46e442fc41c2b86b821562f.png"></img>
          </div>
        )}
        {gridImage && !isUserLoading && (
          <img 
            style={{ width: '100%', maxWidth: '300px' }} 
            src={gridImage} 
            alt="Listening Grid" 
            className={`grid-image ${isFading ? 'fading' : ''}`} 
          />
        )}
      </div>
    </div>
  );
};

export default Grid;