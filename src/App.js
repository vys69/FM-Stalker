import React, { useState, useCallback, memo, useEffect } from 'react';
import Draggable from 'react-draggable';
import XPTaskbar from './components/XPTaskbar';
import RecentTracks from './components/RecentTracks';
import MessageBox from './components/MessageBox';
import NowPlaying from './components/NowPlaying';
import { fetchLastFmData, fetchUserStats } from './utils/api';
import './custom-xp.css';
import './xp-taskbar.css';
import UserStats from './components/UserStats';

const DEFAULT_USERNAME = 'vyzss';

const App = () => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [recentTracks, setRecentTracks] = useState([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('nowPlaying');
  const [messageBox, setMessageBox] = useState({ isVisible: false, message: '' });
  const [refreshCount, setRefreshCount] = useState(0);
  const [lastRefreshTime, setLastRefreshTime] = useState(0);
  const [userStats, setUserStats] = useState(null);
  const [isListening, setIsListening] = useState(true);

  const handleRefresh = useCallback(async () => {
    const now = Date.now();
    if (now - lastRefreshTime < 5000) {
      setRefreshCount(prevCount => {
        const newCount = prevCount + 1;
        if (newCount >= 3) {
          setMessageBox({ isVisible: true, message: "Please wait a moment before refreshing again." });
        }
        return newCount;
      });
      if (refreshCount >= 2) return;
    } else {
      setRefreshCount(0);
    }
    setLastRefreshTime(now);

    try {
      const data = await fetchLastFmData(DEFAULT_USERNAME);
      if (data.recenttracks && data.recenttracks.track.length > 0) {
        const tracks = data.recenttracks.track;
        setRecentTracks(tracks.slice(0, 10));
        
        const lastTrack = tracks[0];
        const lastPlayedTime = new Date(lastTrack.date?.uts * 1000 || Date.now());
        const isCurrentlyListening = (Date.now() - lastPlayedTime) < 3600000; // 1 hour in milliseconds
        setIsListening(isCurrentlyListening);

        if (isCurrentlyListening) {
          setCurrentTrack(lastTrack);
        } else {
          setCurrentTrack(null);
        }
      } else {
        setError(null);
        setCurrentTrack(null);
        setIsListening(false);
        setRecentTracks([]);
      }

      // Fetch user stats after refreshing tracks
      const stats = await fetchUserStats(DEFAULT_USERNAME);
      setUserStats(stats);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Error fetching data');
      setCurrentTrack(null);
      setIsListening(false);
      setRecentTracks([]);
      setUserStats(null);
    }
  }, [lastRefreshTime, refreshCount]);

  const closeMessageBox = useCallback(() => {
    setMessageBox({ isVisible: false, message: '' });
  }, []);

  // Load data once when component mounts
  useEffect(() => {
    handleRefresh();
  }, []); // Empty dependency array

  return (
    <div className="app-container">
      <div className="content">
        <Draggable bounds="parent" handle=".title-bar">
          <div className="window" style={{ width: '300px', position: 'absolute', top: '50px', left: '50px' }}>
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
                </menu>
                <article role="tabpanel" id="tab-nowPlaying" hidden={activeTab !== 'nowPlaying'}>
                  <NowPlaying currentTrack={currentTrack} error={error} onRefresh={handleRefresh} isListening={isListening} />
                </article>
                <article role="tabpanel" id="tab-recentTracks" hidden={activeTab !== 'recentTracks'}>
                  <RecentTracks tracks={recentTracks} />
                </article>
                <article role="tabpanel" id="tab-userStats" hidden={activeTab !== 'userStats'}>
                  <UserStats stats={userStats} error={error} username={DEFAULT_USERNAME} />
                </article>
              </section>
            </div>
          </div>
        </Draggable>
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