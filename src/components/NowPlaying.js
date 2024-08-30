import React from 'react';

const DEFAULT_USERNAME = 'vyzss';

const NowPlaying = ({ currentTrack, error, onRefresh, isListening }) => {
  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!isListening) {
    return <div>{DEFAULT_USERNAME} isn't listening to music right now</div>;
  }

  if (!currentTrack) {
    return <div>Loading...</div>;
  }

  const albumArt = currentTrack.image && currentTrack.image.length > 2 ? currentTrack.image[2]['#text'] : null;

  return (
    <div>
      {albumArt && <img src={albumArt} alt="Album Art" draggable="false" style={{ width: '100%', maxWidth: '300px' }} />}
      <p>{currentTrack.name} by {currentTrack.artist['#text']}</p>
      <button onClick={onRefresh}>Refresh</button>
    </div>
  );
};

export default NowPlaying;