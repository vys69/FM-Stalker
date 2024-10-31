const API_KEY = process.env.REACT_APP_LASTFM_API_KEY;
const BASE_URL = 'https://ws.audioscrobbler.com/2.0/';

const fetchData = async (method, username, limit = 5) => {
  const response = await fetch(`${BASE_URL}?method=${method}&user=${username}&api_key=${API_KEY}&format=json&limit=${limit}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${method} data`);
  }
  return response.json();
};

export const fetchLastFmData = async (username) => {
  try {
    const response = await fetch(
      `${BASE_URL}?method=user.getrecenttracks&user=${username}&api_key=${API_KEY}&format=json&limit=10`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.message || 'Last.fm API error');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching Last.fm data:', error);
    throw error;
  }
};

export const fetchUserStats = async (username) => {
  const data = await fetchData('user.getinfo', username);
  return data.user;
};

export const fetchTopAlbums = async (username) => {
  const data = await fetchData('user.gettopalbums', username);
  return data.topalbums.album;
};

export const fetchTopArtists = async (username) => {
  const data = await fetchData('user.gettopartists', username);
  return data.topartists.artist;
};

export const fetchTopTracks = async (username) => {
  const data = await fetchData('user.gettoptracks', username);
  return data.toptracks.track;
};

export const createUserEmbed = async (username) => {
  try {
    const recentTracks = await fetchLastFmData(username);
    const currentTrack = recentTracks.recenttracks.track[0];
    const isPlaying = currentTrack['@attr']?.nowplaying === 'true';
    
    // Get video URL (you'll need to implement this based on your video service)
    const videoUrl = await getVideoUrl(currentTrack.name, currentTrack.artist['#text']);
    
    return {
      title: `${username}'s Last.fm`,
      description: `${currentTrack.name} - ${currentTrack.artist['#text']}`,
      videoUrl: videoUrl,
      status: isPlaying ? 'Now Playing' : 'Last Played',
      image: currentTrack.image[3]['#text'] // Fallback image if video fails
    };
  } catch (error) {
    console.error('Error creating user embed:', error);
    throw error;
  }
};

// Helper function to get video URL (implement based on your video service)
const getVideoUrl = async (songName, artistName) => {
  // Implement your video service integration here
  // Return video URL that's compatible with Discord embeds
};