import { db } from '../../../lib/db';

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const body = await request.json();
    const result = db.importBackup(body);
    return Response.json({ success: true, data: result });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
