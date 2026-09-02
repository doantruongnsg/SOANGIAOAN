import db from '../../lib/db';
export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const result = db.restoreBackup(req.body);
    res.status(200).json({ success: true, message: 'Đã khôi phục thành công', data: result });
  } catch(e) {
    res.status(500).json({ success: false, error: e.message });
  }
}