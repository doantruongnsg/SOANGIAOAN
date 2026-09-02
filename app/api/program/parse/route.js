import mammoth from "mammoth";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!file || typeof file.arrayBuffer !== "function") {
      return Response.json({ error: "Thiếu file DOCX." }, { status: 400 });
    }
    const name = String(file.name || "").toLowerCase();
    if (!name.endsWith(".docx")) {
      return Response.json({ error: "API này chỉ nhận file .docx." }, { status: 400 });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const [rawResult, htmlResult] = await Promise.all([
      mammoth.extractRawText({ buffer }),
      mammoth.convertToHtml({ buffer }),
    ]);
    return Response.json({
      filename: file.name,
      text: rawResult.value || "",
      html: htmlResult.value || "",
      messages: [...(rawResult.messages || []), ...(htmlResult.messages || [])],
    });
  } catch (error) {
    return Response.json({ error: error?.message || "Không đọc được DOCX." }, { status: 500 });
  }
}
