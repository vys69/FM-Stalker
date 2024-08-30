import React, { useState, useEffect, useCallback, memo } from 'react';
import Pusher from 'pusher-js';
import Draggable from 'react-draggable';
import XPTaskbar from './components/XPTaskbar';
import RecentTracks from './components/RecentTracks';
import MessageBox from './components/MessageBox';
import NowPlaying from './components/NowPlaying';
import InfoWindow from './components/InfoWindow';
import { fetchLastFmData, fetchUserStats } from './utils/api';
import './custom-xp.css';
import './xp-taskbar.css';
import UserStats from './components/UserStats';
import Timer from './components/Timer';

const DEFAULT_USERNAME = 'vyzss';

const pusher = new Pusher(process.env.PUSHER_KEY, {
  cluster: process.env.PUSHER_CLUSTER
});

const channel = pusher.subscribe('fm-stalker-channel');

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
  const [windowPositions, setWindowPositions] = useState({
    lastfmPlayer: { x: 50, y: 50 },
    infoWindow: { x: 100, y: 100 }
  });

  const handleRefresh = useCallback(async () => {
    const now = Date.now();
    if (now - lastRefreshTime < 5000) {
      setMessageBox({ isVisible: true, message: "Please wait a moment before refreshing again." });
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
  }, [lastRefreshTime]);

  const closeMessageBox = useCallback(() => {
    setMessageBox({ isVisible: false, message: '' });
  }, []);

  const handleDragStop = useCallback((id, e, data) => {
    setWindowPositions(prev => ({
      ...prev,
      [id]: { x: data.x, y: data.y }
    }));

    fetch('/api/move-window', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, x: data.x, y: data.y })
    }).catch(error => console.error('Error:', error));
  }, []);

  const handleTabSelect = useCallback((tab) => {
    setActiveTab(tab);

    fetch('/api/select-tab', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tab })
    }).catch(error => console.error('Error:', error));
  }, []);

  useEffect(() => {
    handleRefresh();
    Pusher.logToConsole = true;

    channel.bind('window-moved', function(data) {
      setWindowPositions(prev => ({
        ...prev,
        [data.id]: { x: data.x, y: data.y }
      }));
    });

    channel.bind('tab-selected', function(data) {
      setActiveTab(data.tab);
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe('fm-stalker-channel');
      pusher.disconnect();
    };
  }, [handleRefresh]);

  return (
    <div className="app-container">
      <div className="content">
        <Draggable 
          bounds="parent" 
          handle=".title-bar"
          position={windowPositions.lastfmPlayer}
          onStop={(e, data) => handleDragStop('lastfmPlayer', e, data)}
        >
          <div className="window" style={{ width: '300px', position: 'absolute' }}>
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
                  <button role="tab" aria-selected={activeTab === 'nowPlaying'} aria-controls="tab-nowPlaying" onClick={() => handleTabSelect('nowPlaying')}>Now Playing</button>
                  <button role="tab" aria-selected={activeTab === 'recentTracks'} aria-controls="tab-recentTracks" onClick={() => handleTabSelect('recentTracks')}>Recent Tracks</button>
                  <button role="tab" aria-selected={activeTab === 'userStats'} aria-controls="tab-userStats" onClick={() => handleTabSelect('userStats')}>User Stats</button>
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
        <InfoWindow 
          position={windowPositions.infoWindow}
          onDragStop={(e, data) => handleDragStop('infoWindow', e, data)}
        />
      </div>
      <Timer />
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