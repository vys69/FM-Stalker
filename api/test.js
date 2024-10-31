import { fetchLastFmData } from '../src/utils/api';

export default async function handler(req, res) {
  const { username } = req.query;
  
  try {
    const data = await fetchLastFmData(username);
    const currentTrack = data.recenttracks.track[0];
    const isPlaying = currentTrack['@attr']?.nowplaying === 'true';

    // Return JSON for easier debugging
    return res.status(200).json({
      title: `${username}'s Last.fm Status`,
      description: `${isPlaying ? '▶️ Now Playing:' : '⏸️ Last Played:'} ${currentTrack.name} by ${currentTrack.artist['#text']}`,
      image: currentTrack.image[3]['#text'],
      isPlaying,
      track: currentTrack
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.message });
  }
} 