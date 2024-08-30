import React from 'react';

const RecentTracks = ({ tracks }) => {
  return (
    <div className="recent-tracks">
      <ul className="tree-view">
        {tracks.map((track, index) => (
          <li key={index}>
            <strong>{track.name}</strong> - {track.artist['#text']}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentTracks;