import { createUserEmbed } from '../src/utils/api';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  const { username } = req.query;
  
  try {
    if (username) {
      const embedData = await createUserEmbed(username);
      
      // Set cache headers (optional)
      res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate');
      
      res.status(200).json(embedData);
    } else {
      // Return default metadata
      res.status(200).json({
        title: 'FM Stalker 👀',
        description: 'Stalk me, listen to my music, then brag about how long you\'ve stalked me...',
        image: '/icons/content.png',
        type: 'website'
      });
    }
  } catch (error) {
    console.error('Error generating embed:', error);
    res.status(500).json({ error: 'Failed to generate embed' });
  }
}
