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

export const fetchUserStats = async (username) => {
  const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=${username}&api_key=${process.env.REACT_APP_LASTFM_API_KEY}&format=json`);
  const data = await response.json();

  if (data.error) {
    throw new Error(data.message);
  }

  const totalScrobbles = parseInt(data.user.playcount);
  const registeredDate = new Date(data.user.registered.unixtime * 1000);
  const daysSinceRegistered = (new Date() - registeredDate) / (1000 * 60 * 60 * 24);
  const avgSongsPerDay = (totalScrobbles / daysSinceRegistered).toFixed(2);

  return {
    username: data.user.name,
    avgSongsPerDay,
    totalScrobbles,
  };
};