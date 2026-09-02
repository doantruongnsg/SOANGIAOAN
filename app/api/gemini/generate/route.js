function resolveKey(request) {
  return request.headers.get("x-user-api-key") || process.env.GEMINI_API_KEY || "";
}

export async function POST(request) {
  const key = resolveKey(request);
  if (!key) return Response.json({ error: "Chưa cấu hình GEMINI_API_KEY." }, { status: 400 });
  try {
    const body = await request.json();
    const model = String(body?.model || process.env.GEMINI_MODEL || "gemini-2.0-flash");
    const prompt = String(body?.prompt || "").trim();
    if (!prompt) return Response.json({ error: "Prompt đang trống." }, { status: 400 });

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }] }),
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok) return Response.json({ error: data?.error?.message || `Gemini HTTP ${res.status}` }, { status: res.status });
    const parts = data?.candidates?.[0]?.content?.parts || [];
    const text = parts.map((p) => p.text || "").join("\n").trim();
    if (!text) return Response.json({ error: "Gemini không trả về nội dung." }, { status: 502 });
    return Response.json({ model, text });
  } catch (error) {
    return Response.json({ error: error?.message || "Không gọi được Gemini." }, { status: 500 });
  }
}
