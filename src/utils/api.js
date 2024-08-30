const API_KEY = process.env.REACT_APP_LASTFM_API_KEY;
const USERNAME = process.env.REACT_APP_LASTFM_USERNAME;

export const fetchLastFmData = async (username = USERNAME) => {
  const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${API_KEY}&format=json&limit=10`);
  if (!response.ok) {
    throw new Error('Failed to fetch Last.fm data');
  }
  return response.json();
};

export const fetchUserStats = async (username = USERNAME) => {
  const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=${username}&api_key=${API_KEY}&format=json`);
  if (!response.ok) {
    throw new Error('Failed to fetch user stats');
  }
  const data = await response.json();
  return data.user;
};