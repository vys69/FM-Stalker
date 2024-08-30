import Pusher from 'pusher';

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true
});

export default async function handler(req, res) {
  const { tab } = req.body;
  await pusher.trigger('fm-stalker-channel', 'tab-selected', { tab });
  res.status(200).json({ message: 'Tab selected' });
}