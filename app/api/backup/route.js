import { db } from '../../../lib/db';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const data = db.exportBackup();
    return new Response(JSON.stringify(data, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': 'attachment; filename="soangiaoan_backup.json"'
      }
    });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
