import { db } from '../../../lib/db';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const stats = db.getStats();
    return Response.json({ success: true, data: stats });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
