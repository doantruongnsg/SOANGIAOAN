import db from '../../../lib/db';
export default function handler(req, res) {
  const { id } = req.query;
  if (req.method === 'GET') {
    const sched = db.getScheduleById(id);
    if (!sched) return res.status(404).json({ success: false, error: 'Không tìm thấy' });
    return res.status(200).json({ success: true, data: sched });
  }
  if (req.method === 'PUT') {
    const saved = db.saveSchedule({ ...req.body, id });
    return res.status(200).json({ success: true, data: saved });
  }
  if (req.method === 'DELETE') {
    db.deleteSchedule(id);
    return res.status(200).json({ success: true, message: 'Đã xóa' });
  }
  res.status(405).end();
}