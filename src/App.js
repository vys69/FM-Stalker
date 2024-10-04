import React, { useState, useCallback, useEffect, memo, useRef } from 'react';
import Draggable from 'react-draggable';
import XPTaskbar from './components/XPTaskbar';
import RecentTracks from './components/RecentTracks';
import MessageBox from './components/MessageBox';
import NowPlaying from './components/NowPlaying';
import UserStats from './components/UserStats';
import Timer from './components/Timer';
import Grid from './components/Grid';  // Import the new Grid component
import { fetchLastFmData, fetchUserStats, fetchTopAlbums, fetchTopArtists, fetchTopTracks } from './utils/api';
import './custom-xp.css';
import './xp-taskbar.css';

const App = () => {
  const [username, setUsername] = useState('');
  const [currentTrack, setCurrentTrack] = useState(null);
  const [recentTracks, setRecentTracks] = useState([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('nowPlaying');
  const [messageBox, setMessageBox] = useState({ isVisible: false, message: '' });
  const [userStats, setUserStats] = useState(null);
  const [isListening, setIsListening] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [musicRefreshCount, setMusicRefreshCount] = useState(0);

  const [windowPositions, setWindowPositions] = useState(() => {
    const saved = localStorage.getItem('windowPositions');
    return saved ? JSON.parse(saved) : {
      lastfmPlayer: { x: 50, y: 50 },
      stalkingTimer: { x: window.innerWidth - 250, y: 50 },
    };
  });

  const [topAlbums, setTopAlbums] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [topTracks, setTopTracks] = useState([]);

  const handleMusicRefresh = useCallback(async () => {
    setMusicRefreshCount(prev => prev + 1);
    if (!username) return;

    setIsLoading(true);
    setError(null);

    try {
      const [data, stats, albums, artists, tracks] = await Promise.all([
        fetchLastFmData(username),
        fetchUserStats(username),
        fetchTopAlbums(username),
        fetchTopArtists(username),
        fetchTopTracks(username)
      ]);

      if (data.recenttracks && data.recenttracks.track.length > 0) {
        const tracks = data.recenttracks.track;
        setRecentTracks(tracks.slice(0, 10));
        
        const lastTrack = tracks[0];
        const lastPlayedTime = new Date(lastTrack.date?.uts * 1000 || Date.now());
        const isCurrentlyListening = (Date.now() - lastPlayedTime) < 3600000;
        setIsListening(isCurrentlyListening);

        if (isCurrentlyListening) {
          setCurrentTrack(lastTrack);
        } else {
          setCurrentTrack(null);
        }
      } else {
        setCurrentTrack(null);
        setIsListening(false);
        setRecentTracks([]);
      }

      setUserStats(stats);
      setTopAlbums(albums);
      setTopArtists(artists);
      setTopTracks(tracks);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Error fetching data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [username]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlUsername = urlParams.get('username');
    if (urlUsername) {
      setUsername(urlUsername);
    }
  }, []);

  useEffect(() => {
    if (username) {
      handleMusicRefresh();
    }
  }, [username, handleMusicRefresh]);

  const closeMessageBox = useCallback(() => {
    setMessageBox({ isVisible: false, message: '' });
  }, []);

  const updateWindowPosition = useCallback((windowName, x, y) => {
    const newPositions = {
      ...windowPositions,
      [windowName]: { x, y }
    };
    setWindowPositions(newPositions);
    localStorage.setItem('windowPositions', JSON.stringify(newPositions));
  }, [windowPositions]);

  const draggableRef = useRef(null);

  return (
    <div className="app-container">
      <div className="content">
        <Draggable
          bounds="parent"
          handle=".title-bar"
          position={windowPositions.lastfmPlayer}
          onStop={(e, data) => updateWindowPosition('lastfmPlayer', data.x, data.y)}
          nodeRef={draggableRef}
        >
          <div ref={draggableRef} className="window" style={{ width: '315px', position: 'absolute' }}>
            <div className="title-bar">
              <div className="title-bar-text">Last.fm Player</div>
              <div className="title-bar-controls">
                <button aria-label="Minimize"></button>
                <button aria-label="Maximize"></button>
                <button aria-label="Close"></button>
              </div>
            </div>
            <div className="window-body">
              <section className="tabs">
                <menu role="tablist" aria-label="Last.fm Tabs">
                  <button role="tab" aria-selected={activeTab === 'nowPlaying'} aria-controls="tab-nowPlaying" onClick={() => setActiveTab('nowPlaying')}>Now Playing</button>
                  <button role="tab" aria-selected={activeTab === 'recentTracks'} aria-controls="tab-recentTracks" onClick={() => setActiveTab('recentTracks')}>Recent Tracks</button>
                  <button role="tab" aria-selected={activeTab === 'userStats'} aria-controls="tab-userStats" onClick={() => setActiveTab('userStats')}>User Stats</button>
                  <button role="tab" aria-selected={activeTab === 'grid'} aria-controls="tab-grid" onClick={() => setActiveTab('grid')}>Grid</button>
                </menu>
                <article role="tabpanel" id="tab-nowPlaying" hidden={activeTab !== 'nowPlaying'}>
                  <NowPlaying currentTrack={currentTrack} username={username} error={error} onRefresh={handleMusicRefresh} isListening={isListening} />
                </article>
                <article role="tabpanel" id="tab-recentTracks" hidden={activeTab !== 'recentTracks'}>
                  <RecentTracks tracks={recentTracks} />
                </article>
                <article role="tabpanel" id="tab-userStats" hidden={activeTab !== 'userStats'}>
                  <UserStats stats={userStats} error={error} username={username} topAlbums={topAlbums} topArtists={topArtists} topTracks={topTracks} />
                </article>
                <article role="tabpanel" id="tab-grid" hidden={activeTab !== 'grid'}>
                  <Grid username={username} />
                </article>
              </section>
            </div>
          </div>
        </Draggable>
        
        <Timer 
          position={windowPositions.stalkingTimer}
          username={username}
          isListening={isListening}
          isLoading={isLoading}
          onPositionChange={(x, y) => updateWindowPosition('stalkingTimer', x, y)}
        />
      </div>
      <XPTaskbar />
      <MessageBox 
        message={messageBox.message}
        isVisible={messageBox.isVisible}
        onClose={closeMessageBox}
      />
    </div>
  );
};

export default memo(App);