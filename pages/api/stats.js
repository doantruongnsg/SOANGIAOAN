import db from '../../lib/db';
export default function handler(req, res) {
  try {
    const stats = db.getStats();
    res.status(200).json({ success: true, data: stats });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
}