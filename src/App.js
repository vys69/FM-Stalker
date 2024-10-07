import React, { useState, useCallback, useEffect, memo, useRef } from 'react';
import { ToastProvider, useToast } from './contexts/ToastContext';
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
import SettingsWindow from './components/SettingsWindow';  // Import the new SettingsWindow

const AppContent = () => {
  const { showToast } = useToast();
  const [username, setUsername] = useState(() => {
    // Remove localStorage usage
    // const savedUsername = localStorage.getItem('lastfm_username');
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('username') || 'vyzss'; // Default to 'vyzss' if no username in URL
  });

  const [currentTrack, setCurrentTrack] = useState(null);
  const [recentTracks, setRecentTracks] = useState([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('nowPlaying');
  const [messageBox, setMessageBox] = useState({ isVisible: false, message: '' });
  const [userStats, setUserStats] = useState(null);
  const [isListening, setIsListening] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('appSettings');
    return savedSettings ? JSON.parse(savedSettings) : {
      saveWindowPositions: false,
      enableTimer: false,
      windows: {
        lastfmPlayer: {x: 30, y: 22},
        searchWindow: {x: 28, y: 639},
        settingsWindow: {x: 29, y: 483},
        stalkingTimer: {x: 30, y: 484.61}
      }
    };
  });

  const [windowPositions, setWindowPositions] = useState(() => {
    const savedPositions = localStorage.getItem('windowPositions');
    return savedPositions ? JSON.parse(savedPositions) : {
      lastfmPlayer: { x: 30, y: 22 },
      stalkingTimer: { x: 30, y: 484.61 },
      searchWindow: { x: 30, y: 606 },
      settingsWindow: { x: 250, y: 22 },
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
    console.log('Starting music refresh for:', username);
    console.log('Refreshing music data for username:', username);  // Add this log

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
      showToast('Error fetching data. Please try again.', 'error');
    } finally {
      setIsLoading(false);
      console.log('Data fetched successfully for:', username);
    }
  }, [username, showToast]); // Include all dependencies here

  const [resetTimer, setResetTimer] = useState(false);

  const handleSearch = useCallback(async (searchedUsername) => {
    if (searchedUsername.length > 50) {
      showToast('Username is too long!', 'error');
      return;
    }

    setIsLoading(true);
    setError(null);
    clearAllData(); // Clear all data immediately

    try {
      // Attempt to fetch user data to validate the username
      await fetchUserStats(searchedUsername);

      // If successful, update username
      setUsername(searchedUsername);

      // Remove localStorage update
      // localStorage.setItem('lastfm_username', searchedUsername);

      // Update URL
      const newUrl = new URL(window.location);
      newUrl.searchParams.set('username', searchedUsername);
      window.history.pushState({}, '', newUrl);

      console.log('Username updated in URL:', searchedUsername); // Debug log

      // Reset the timer
      setResetTimer(true);

      // Trigger full data refresh
      await handleMusicRefresh();

    } catch (err) {
      console.error('Error searching user:', err);
      showToast("User doesn't exist", 'error');
    } finally {
      setIsLoading(false);
    }
  }, [handleMusicRefresh, showToast]);

  useEffect(() => {
    handleMusicRefresh();
    console.log('Effect triggered, current username:', username);
    // Debug log to check initial username
    // console.log('Initial username:', username);
  }, [handleMusicRefresh, username]); // Add username to the dependency array

  useEffect(() => {
    if (resetTimer) {
      setResetTimer(false);
    }
  }, [resetTimer]);

  const closeMessageBox = useCallback(() => {
    setMessageBox({ isVisible: false, message: '' });
  }, []);

  const updateWindowPosition = (windowName, x, y) => {
    setWindowPositions(prev => ({
      ...prev,
      [windowName]: { x, y }
    }));
  };

  // Save window positions to localStorage only when the setting is enabled
  useEffect(() => {
    if (settings.saveWindowPositions) {
      localStorage.setItem('windowPositions', JSON.stringify(windowPositions));
    }
  }, [windowPositions, settings.saveWindowPositions]);

  const lastfmPlayerRef = useRef(null);
  const searchWindowRef = useRef(null);
  const settingsWindowRef = useRef(null);

  const handleSaveSettings = useCallback((newSettings) => {
    console.log('Parent: handleSaveSettings called with', newSettings);
    setSettings(newSettings);
    // Remove any direct calls to showToast from here
  }, [/* add any dependencies */]);

  // Use this effect to apply settings
  useEffect(() => {
    // Apply timer setting
    if (!settings.enableTimer) {
      // Stop the timer
      // You'll need to implement this logic in your Timer component
    }
    // Apply other settings as needed
  }, [settings]);

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
                  <button className="tab-button" disabled={isLoading} role="tab" aria-selected={activeTab === 'globalStats'} aria-controls="tab-globalStats" onClick={() => setActiveTab('globalStats')}>Global Stats</button>
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

        <Draggable
          bounds="parent"
          handle=".title-bar"
          position={windowPositions.settingsWindow}
          onStop={(e, data) => updateWindowPosition('settingsWindow', data.x, data.y)}
          nodeRef={settingsWindowRef}
        >
          <div ref={settingsWindowRef} style={{ position: 'absolute' }}>
            <SettingsWindow
              onSave={handleSaveSettings}
              initialSettings={settings}
              isLoading={isLoading}
            />
          </div>
        </Draggable>

        <Timer
          position={windowPositions.stalkingTimer}
          username={username}
          isListening={isListening}
          isLoading={isLoading}
          onPositionChange={(x, y) => updateWindowPosition('stalkingTimer', x, y)}
          enabled={settings.enableTimer}
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

const App = () => {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
};

export default memo(App);