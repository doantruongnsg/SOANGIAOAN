export default function handler(req, res) {
  res.status(200).json({ status: 'ok', version: '2.0.0', framework: 'Next.js', time: new Date().toISOString() });
}