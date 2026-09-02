import db from '../../../lib/db';
export default function handler(req, res) {
  const { id } = req.query;
  if (req.method === 'GET') {
    const prog = db.getProgramById(id);
    if (!prog) return res.status(404).json({ success: false, error: 'Không tìm thấy' });
    return res.status(200).json({ success: true, data: prog });
  }
  if (req.method === 'PUT') {
    const saved = db.saveProgram({ ...req.body, id });
    return res.status(200).json({ success: true, data: saved });
  }
  if (req.method === 'DELETE') {
    db.deleteProgram(id);
    return res.status(200).json({ success: true, message: 'Đã xóa' });
  }
  res.status(405).end();
}