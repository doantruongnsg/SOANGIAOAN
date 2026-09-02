import db from '../../../../lib/db';
export default function handler(req, res) {
  const { slug } = req.query;
  const scheduleId = slug?.[0];
  const sessionStt = slug?.[1];
  try {
    const lp = db.getLessonPlanBySession(scheduleId, sessionStt);
    res.status(200).json({ success: true, data: lp });
  } catch(e) {
    res.status(500).json({ success: false, error: e.message });
  }
}