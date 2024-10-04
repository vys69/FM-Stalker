import React from 'react';

const UserStats = ({ stats, username, topAlbums, topArtists, topTracks }) => {
  return (
    <div>
      {stats && (
        <div>
          <p>Username: {username}</p>
          <p>Average songs per day: {Number((stats.playcount / stats.registered.unixtime * 86400).toFixed(2))}</p>
          <p>Total scrobbles: {stats.playcount}</p>
          <hr />
          
          <details>
            <summary>Top Albums</summary>
            {topAlbums && topAlbums.length > 0 ? (
              <ul>
                {topAlbums.slice(0, 5).map((album, index) => (
                  <li key={index}>{album.name} by {album.artist.name} <span className="playcount">({album.playcount} plays)</span></li>
                ))}
              </ul>
            ) : (
              <p>No top albums data available</p>
            )}
          </details>

          <details>
            <summary>Top Artists</summary>
            {topArtists && topArtists.length > 0 ? (
              <ul>
                {topArtists.slice(0, 5).map((artist, index) => (
                  <li key={index}>{artist.name} <span className="playcount">({artist.playcount} plays)</span></li>
                ))}
              </ul>
            ) : (
              <p>No top artists data available</p>
            )}
          </details>

          <details>
            <summary>Top Tracks</summary>
            {topTracks && topTracks.length > 0 ? (
              <ul>
                {topTracks.slice(0, 5).map((track, index) => (
                  <li key={index}>{track.name} by {track.artist.name} <span className="playcount">({track.playcount} plays)</span></li>
                ))}
              </ul>
            ) : (
              <p>No top tracks data available</p>
            )}
          </details>
        </div>
      )}
    </div>
  );
};

export default UserStats;