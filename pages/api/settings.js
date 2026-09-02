import db from '../../lib/db';
export default function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const saved = db.saveSettings(req.body);
      return res.status(200).json({ success: true, data: saved });
    } catch(e) {
      return res.status(500).json({ success: false, error: e.message });
    }
  }
  try {
    const settings = db.getSettings();
    res.status(200).json({ success: true, data: settings });
  } catch(e) {
    res.status(500).json({ success: false, error: e.message });
  }
}