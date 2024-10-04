import React from 'react';
import TrackItem from './TrackItem';

const RecentTracks = ({ tracks }) => {
  return (
    <div className="recent-tracks">
      <ul className="tree-view">
        {tracks.map((track, index) => (
          <TrackItem key={index} track={track} index={index} />
        ))}
      </ul>
    </div>
  );
};

export default RecentTracks;