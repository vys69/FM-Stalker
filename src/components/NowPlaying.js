import React from 'react';

const DEFAULT_USERNAME = 'vyzss';

const NowPlaying = ({ currentTrack, error, onRefresh, isListening }) => {
  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!isListening) {
    return (
      <div>
        <p>{DEFAULT_USERNAME} isn't listening to music right now</p>
        <button onClick={onRefresh}>Refresh</button>
      </div>
    );
  }

  if (!currentTrack) {
    return (
      <div>
        <p>Loading...</p>
        <button onClick={onRefresh}>Refresh</button>
      </div>
    );
  }

  const albumArt = currentTrack.image && currentTrack.image.length > 2 ? currentTrack.image[2]['#text'] : null;

  return (
    <div>
      {albumArt && <img src={albumArt} alt="Album Art" style={{ width: '100%', maxWidth: '300px' }} />}
      <p><strong>{currentTrack.name}</strong></p>
      <p>{currentTrack.artist['#text']}</p>
      <button onClick={onRefresh}>Refresh</button>
    </div>
  );
};

export default NowPlaying;