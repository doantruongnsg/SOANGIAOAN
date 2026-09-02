import db from '../../lib/db';
export default function handler(req, res) {
  const data = db.getBackupData();
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename="BKNSG_GiaoAn_Backup_${new Date().toISOString().slice(0, 10)}.json"`);
  res.status(200).json(data);
}