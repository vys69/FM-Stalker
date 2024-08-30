const API_KEY = process.env.REACT_APP_LASTFM_API_KEY;
const USERNAME = process.env.REACT_APP_LASTFM_USERNAME;

export const fetchLastFmData = async () => {
  const response = await fetch(
    `https://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks&user=${USERNAME}&api_key=${API_KEY}&format=json&limit=10`
  );
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};