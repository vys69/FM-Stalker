import { fetchLastFmData } from '../src/utils/api';

export default async function handler(req, res) {
  // Check if the request is from a social media crawler
  const userAgent = req.headers['user-agent'] || '';
  const isCrawler = /facebookexternalhit|discordbot|twitterbot|whatsapp|preview/i.test(userAgent);

  if (!isCrawler) {
    // For regular users, return nothing and let the React app handle the request
    return res.status(200).end();
  }

  const { username } = req.query;

  try {
    if (!username) {
      // Default meta tags for the main site
      return res.status(200).send(getDefaultHtml());
    }

    // Fetch Last.fm data for the user
    const data = await fetchLastFmData(username);
    const currentTrack = data.recenttracks.track[0];
    const isPlaying = currentTrack['@attr']?.nowplaying === 'true';

    // Generate HTML with meta tags for social media crawlers
    const html = generateHtml({
      title: `${username}'s Last.fm Status`,
      description: `${isPlaying ? 'Now Playing' : 'Last Played'}: ${currentTrack.name} by ${currentTrack.artist['#text']}`,
      image: currentTrack.image[3]['#text'] || '/icons/content.png',
      url: `https://fmstalker.com?username=${username}`,
      username,
      track: currentTrack,
      isPlaying
    });

    res.status(200).send(html);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).end();
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