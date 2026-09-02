function resolveKey(request) {
  return request.headers.get("x-user-api-key") || process.env.GEMINI_API_KEY || "";
}

export async function GET(request) {
  const key = resolveKey(request);
  if (!key) return Response.json({ error: "Chưa cấu hình GEMINI_API_KEY." }, { status: 400 });
  try {
    const res = await fetch("https://generativelanguage.googleapis.com/v1beta/models", {
      headers: { "x-goog-api-key": key },
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok) return Response.json({ error: data?.error?.message || `Gemini HTTP ${res.status}` }, { status: res.status });
    const models = (data.models || [])
      .filter((m) => (m.supportedGenerationMethods || []).includes("generateContent"))
      .map((m) => String(m.name || "").replace(/^models\//, ""))
      .filter(Boolean);
    return Response.json({ models });
  } catch (error) {
    return Response.json({ error: error?.message || "Không lấy được danh sách model." }, { status: 500 });
  }
}
