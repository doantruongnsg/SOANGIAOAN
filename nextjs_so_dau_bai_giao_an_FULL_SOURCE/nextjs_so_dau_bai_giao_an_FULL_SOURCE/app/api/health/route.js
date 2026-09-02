export async function GET() {
  return Response.json({ ok: true, service: "so-dau-bai-giao-an", time: new Date().toISOString() });
}
