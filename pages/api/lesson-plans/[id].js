import db from '../../../lib/db';
export default function handler(req, res) {
  const { id } = req.query;
  if (req.method === 'GET') {
    const lp = db.getLessonPlanById(id);
    if (!lp) return res.status(404).json({ success: false, error: 'Không tìm thấy' });
    return res.status(200).json({ success: true, data: lp });
  }
  if (req.method === 'PUT') {
    const saved = db.saveLessonPlan({ ...req.body, id });
    return res.status(200).json({ success: true, data: saved });
  }
  if (req.method === 'DELETE') {
    db.deleteLessonPlan(id);
    return res.status(200).json({ success: true, message: 'Đã xóa' });
  }
  res.status(405).end();
}