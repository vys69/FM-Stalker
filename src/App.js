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
import SearchWindow from './components/SearchWindow';

const App = () => {
  const [username, setUsername] = useState(() => {
    const savedUsername = localStorage.getItem('lastfm_username');
    const urlParams = new URLSearchParams(window.location.search);
    return savedUsername || urlParams.get('username') || 'vyzss';
  });

  const [currentTrack, setCurrentTrack] = useState(null);
  const [recentTracks, setRecentTracks] = useState([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('nowPlaying');
  const [messageBox, setMessageBox] = useState({ isVisible: false, message: '' });
  const [userStats, setUserStats] = useState(null);
  const [isListening, setIsListening] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [musicRefreshCount, setMusicRefreshCount] = useState(0);

  const [windowPositions, setWindowPositions] = useState(() => {
    const saved = localStorage.getItem('windowPositions');
    return saved ? JSON.parse(saved) : {
      lastfmPlayer: { x: 30, y: 22 },
      stalkingTimer: { x: 30, y: 484.61 },
      searchWindow: { x: 30, y: 606 },
    };
  });

  const [topAlbums, setTopAlbums] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [topTracks, setTopTracks] = useState([]);

  const clearAllData = () => {
    setRecentTracks([]);
    setCurrentTrack(null);
    setIsListening(false);
    setUserStats(null);
    setTopAlbums([]);
    setTopArtists([]);
    setTopTracks([]);
  };

  const handleMusicRefresh = useCallback(async () => {
    if (!username) return;

    setIsLoading(true);
    setError(null);

    try {
      const [recentTracksData, userStatsData, topAlbumsData, topArtistsData, topTracksData] = await Promise.all([
        fetchLastFmData(username),
        fetchUserStats(username),
        fetchTopAlbums(username),
        fetchTopArtists(username),
        fetchTopTracks(username)
      ]);

      // Process and set state for each data type
      setRecentTracks(recentTracksData.recenttracks.track);
      setUserStats(userStatsData);
      setTopAlbums(topAlbumsData);
      setTopArtists(topArtistsData);
      setTopTracks(topTracksData);

      // Update current track and listening status
      const currentTrack = recentTracksData.recenttracks.track[0];
      setCurrentTrack(currentTrack);
      setIsListening(currentTrack['@attr']?.nowplaying === 'true');

    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Error fetching data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [username]);

  const [resetTimer, setResetTimer] = useState(false);

  const handleSearch = useCallback(async (searchedUsername) => {
    if (searchedUsername.length > 50) {
      setError('Username is too long!');
      return;
    }

    setIsLoading(true);
    setError(null);
    clearAllData(); // Clear all data immediately

    try {
      // Attempt to fetch user data to validate the username
      await fetchUserStats(searchedUsername);

      // If successful, update username and trigger full refresh
      setUsername(searchedUsername);
      localStorage.setItem('lastfm_username', searchedUsername);
      
      // Update URL
      const newUrl = new URL(window.location);
      newUrl.searchParams.set('username', searchedUsername);
      window.history.pushState({}, '', newUrl);

      // Reset the timer
      setResetTimer(true);

      // Trigger full data refresh
      await handleMusicRefresh();

    } catch (err) {
      console.error('Error searching user:', err);
      setError("User doesn't exist");
    } finally {
      setIsLoading(false);
    }
  }, [handleMusicRefresh]);

  useEffect(() => {
    handleMusicRefresh();
  }, [handleMusicRefresh]);

  useEffect(() => {
    if (resetTimer) {
      setResetTimer(false);
    }
  }, [resetTimer]);

  const closeMessageBox = useCallback(() => {
    setMessageBox({ isVisible: false, message: '' });
  }, []);

  const updateWindowPosition = useCallback((windowName, x, y) => {
    setWindowPositions(prev => {
      const newPositions = { ...prev, [windowName]: { x, y } };
      localStorage.setItem('windowPositions', JSON.stringify(newPositions));
      return newPositions;
    });
  }, []);

  const lastfmPlayerRef = useRef(null);
  const searchWindowRef = useRef(null);

  return (
    <div className="app-container">
      <div className="content" style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
        <Draggable
          bounds="parent"
          handle=".title-bar"
          position={windowPositions.lastfmPlayer}
          onStop={(e, data) => updateWindowPosition('lastfmPlayer', data.x, data.y)}
          nodeRef={lastfmPlayerRef}
        >
          <div ref={lastfmPlayerRef} className="window" style={{ width: '315px', height: '450px', position: 'absolute' }}>
            <div className="title-bar">
              <div className="title-bar-text">Last.fm Player</div>
              <div className="title-bar-controls">
                <button aria-label="Minimize"></button>
                <button aria-label="Maximize"></button>
                <button aria-label="Close"></button>
              </div>
            </div>
            <div className="window-body scrollable-content">
              <section className="tabs">
                <menu role="tablist" aria-label="Last.fm Tabs">
                  <button className="tab-button" disabled={isLoading} role="tab" aria-selected={activeTab === 'nowPlaying'} aria-controls="tab-nowPlaying" onClick={() => setActiveTab('nowPlaying')}>Now Playing</button>
                  <button className="tab-button" disabled={isLoading} role="tab" aria-selected={activeTab === 'recentTracks'} aria-controls="tab-recentTracks" onClick={() => setActiveTab('recentTracks')}>Recent Tracks</button>
                  <button className="tab-button" disabled={isLoading} role="tab" aria-selected={activeTab === 'userStats'} aria-controls="tab-userStats" onClick={() => setActiveTab('userStats')}>User Stats</button>
                  <button className="tab-button" disabled={isLoading} role="tab" aria-selected={activeTab === 'grid'} aria-controls="tab-grid" onClick={() => setActiveTab('grid')}>Grid</button>
                </menu>
                <article role="tabpanel" id="tab-nowPlaying" hidden={activeTab !== 'nowPlaying'}>
                  <NowPlaying currentTrack={currentTrack} username={username} error={error} onRefresh={handleMusicRefresh} isListening={isListening} isLoading={isLoading} />
                </article>
                <article role="tabpanel" id="tab-recentTracks" hidden={activeTab !== 'recentTracks'}>
                  <RecentTracks tracks={recentTracks} isLoading={isLoading} />
                </article>
                <article role="tabpanel" id="tab-userStats" hidden={activeTab !== 'userStats'}>
                  <UserStats stats={userStats} error={error} username={username} topAlbums={topAlbums} topArtists={topArtists} topTracks={topTracks} isLoading={isLoading} />
                </article>
                <article role="tabpanel" id="tab-grid" hidden={activeTab !== 'grid'}>
                  <Grid username={username} isUserLoading={isLoading} />
                </article>
              </section>
            </div>
          </div>
        </Draggable>
        
        <Draggable
          bounds="parent"
          handle=".title-bar"
          defaultPosition={windowPositions.searchWindow}
          onStop={(e, data) => updateWindowPosition('searchWindow', data.x, data.y)}
          nodeRef={searchWindowRef}
        >
          <div ref={searchWindowRef} style={{ position: 'absolute' }}>
            <SearchWindow 
              onSearch={handleSearch} 
              initialUsername={username} 
              isLoading={isLoading}
              currentUsername={username}
            />
          </div>
        </Draggable>
        
        <Timer 
          position={windowPositions.stalkingTimer}
          username={username}
          isListening={isListening}
          isLoading={isLoading}
          onPositionChange={(x, y) => updateWindowPosition('stalkingTimer', x, y)}
          resetTimer={resetTimer}
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