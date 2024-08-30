import React from 'react';

const UserStats = ({ stats, error, username }) => {
  return (
    <div>
      {error && <p>Error: {error}</p>}
      {stats && (
        <div>
          <p>Username: {username}</p>
          <p>Average songs per day: {stats.avgSongsPerDay}</p>
          <p>Total scrobbles: {stats.totalScrobbles}</p>
        </div>
      )}
    </div>
  );
};

export default UserStats;