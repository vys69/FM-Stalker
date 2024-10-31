import { fetchLastFmData } from '../src/utils/api';

export default async function handler(req, res) {
  try {
    // Extract username from URL or query params
    const url = new URL(req.url, `https://${req.headers.host}`);
    const username = url.searchParams.get('username');

    if (!username) {
      return res.status(200).send(getDefaultHtml());
    }

    // Fetch Last.fm data
    const data = await fetchLastFmData(username);
    const currentTrack = data.recenttracks.track[0];
    const isPlaying = currentTrack['@attr']?.nowplaying === 'true';

    const html = `<!DOCTYPE html>
    <html>
      <head>
        <title>${username}'s Last.fm Status</title>
        <meta property="og:title" content="${username}'s Last.fm Status">
        <meta property="og:description" content="${isPlaying ? '▶️ Now Playing:' : '⏸️ Last Played:'} ${currentTrack.name} by ${currentTrack.artist['#text']}">
        <meta property="og:image" content="${currentTrack.image[3]['#text']}">
        <meta property="og:url" content="https://fmstalker.com/?username=${username}">
        <meta property="og:type" content="website">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="${username}'s Last.fm Status">
        <meta name="twitter:description" content="${isPlaying ? '▶️ Now Playing:' : '⏸️ Last Played:'} ${currentTrack.name} by ${currentTrack.artist['#text']}">
        <meta name="twitter:image" content="${currentTrack.image[3]['#text']}">
        <meta name="theme-color" content="${isPlaying ? '#57F287' : '#ED4245'}">
      </head>
      <body>
        <script>
          window.location.href = 'https://fmstalker.com/?username=${username}';
        </script>
      </body>
    </html>`;

    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(html);

  } catch (error) {
    console.error('Error:', error);
    return res.status(200).send(getDefaultHtml());
  }
}

function getDefaultHtml() {
  return generateHtml({
    title: 'FM Stalker 👀',
    description: 'Stalk me, listen to my music, then brag about how long you\'ve stalked me...',
    image: '/icons/content.png',
    url: 'https://fmstalker.com'
  });
}

function generateHtml(data) {
  // Get the contents of your index.html file
  const indexHtml = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <link rel="icon" href="/icons/favicon.png" />
    
    <title>${data.title}</title>
    <meta name="title" content="${data.title}">
    <meta name="description" content="${data.description}">

    <meta property="og:type" content="website">
    <meta property="og:url" content="${data.url}">
    <meta property="og:title" content="${data.title}">
    <meta property="og:description" content="${data.description}">
    <meta property="og:image" content="${data.image}">
    
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="${data.url}">
    <meta property="twitter:title" content="${data.title}">
    <meta property="twitter:description" content="${data.description}">
    <meta property="twitter:image" content="${data.image}">

    <link rel="manifest" href="/manifest.json" />
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
  </html>`;

  return indexHtml;
} 