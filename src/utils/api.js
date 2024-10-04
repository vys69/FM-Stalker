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
  return fetchData('user.getrecenttracks', username, 10);
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