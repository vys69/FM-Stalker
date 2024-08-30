import React, { useState, useCallback, memo } from 'react';
import Draggable from 'react-draggable';
import XPTaskbar from './components/XPTaskbar';
import RecentTracks from './components/RecentTracks';
import MessageBox from './components/MessageBox';
import NowPlaying from './components/NowPlaying';
import { fetchLastFmData } from './utils/api';
import './custom-xp.css';
import './xp-taskbar.css';

const App = () => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [recentTracks, setRecentTracks] = useState([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('nowPlaying');
  const [messageBox, setMessageBox] = useState({ isVisible: false, message: '' });
  const [refreshCount, setRefreshCount] = useState(0);
  const [lastRefreshTime, setLastRefreshTime] = useState(0);

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
      const data = await fetchLastFmData();
      if (data.recenttracks && data.recenttracks.track.length > 0) {
        const tracks = data.recenttracks.track;
        const newCurrentTrack = tracks[0];
        setRecentTracks(tracks.slice(0, 10));
        
        if (!currentTrack || newCurrentTrack.name !== currentTrack.name || newCurrentTrack.artist['#text'] !== currentTrack.artist['#text']) {
          setCurrentTrack(newCurrentTrack);
        } else if (newCurrentTrack['@attr'] && newCurrentTrack['@attr'].nowplaying === 'true') {
          setMessageBox({ isVisible: true, message: `You're currently listening to: ${newCurrentTrack.name} by ${newCurrentTrack.artist['#text']}` });
        } else {
          setMessageBox({ isVisible: true, message: `Last played: ${newCurrentTrack.name} by ${newCurrentTrack.artist['#text']}` });
        }
      } else {
        setError('No recent tracks found');
      }
    } catch (err) {
      console.error('Error fetching data from Last.fm:', err);
      setError('Error fetching data from Last.fm');
    }
  }, [currentTrack, lastRefreshTime, refreshCount]);

  const closeMessageBox = useCallback(() => {
    setMessageBox({ isVisible: false, message: '' });
  }, []);

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
                </menu>
                <article role="tabpanel" id="tab-nowPlaying" hidden={activeTab !== 'nowPlaying'}>
                  <NowPlaying currentTrack={currentTrack} error={error} onRefresh={handleRefresh} />
                </article>
                <article role="tabpanel" id="tab-recentTracks" hidden={activeTab !== 'recentTracks'}>
                  <RecentTracks tracks={recentTracks} />
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