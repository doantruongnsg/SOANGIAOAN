import { db } from '../../../lib/db';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const settings = db.getSettings();
    return Response.json({ success: true, data: settings });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const saved = db.saveSettings(body);
    return Response.json({ success: true, data: saved });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
