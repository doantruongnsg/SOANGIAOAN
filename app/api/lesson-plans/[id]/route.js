import { db } from '../../../../lib/db';

export const runtime = 'nodejs';

export async function GET(request, { params }) {
  try {
    const item = db.getLessonPlan(params.id);
    if (!item) return Response.json({ success: false, error: 'Not found' }, { status: 404 });
    return Response.json({ success: true, data: item });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const del = db.deleteLessonPlan(params.id);
    return Response.json({ success: true, data: del });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
