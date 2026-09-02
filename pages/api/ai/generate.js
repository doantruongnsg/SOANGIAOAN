import https from 'https';
import db from '../../../lib/db';

function callGemini(apiKey, model, prompt) {
  return new Promise((resolve, reject) => {
    const cleanModel = model || 'gemini-2.5-flash';
    const postData = JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 2048 }
    });
    const options = {
      hostname: 'generativelanguage.googleapis.com',
      port: 443,
      path: `/v1beta/models/${encodeURIComponent(cleanModel)}:generateContent?key=${encodeURIComponent(apiKey)}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    const req = https.request(options, (response) => {
      let body = '';
      response.on('data', c => body += c);
      response.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (response.statusCode >= 400) return reject(new Error(parsed.error?.message || `HTTP ${response.statusCode}`));
          const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text || '';
          resolve({ text, raw: parsed });
        } catch (e) {
          reject(new Error(`Gemini response error: ${e.message}`));
        }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const { prompt, model, apiKey } = req.body;
    const settings = db.getSettings();
    const key = apiKey || settings.gemini_api_key;
    const mdl = model || settings.gemini_model || 'gemini-2.5-flash';
    if (!key) return res.status(400).json({ success: false, error: 'Chưa cấu hình Gemini API Key' });
    if (!prompt) return res.status(400).json({ success: false, error: 'Prompt không được để trống' });
    const result = await callGemini(key, mdl, prompt);
    res.status(200).json({ success: true, text: result.text, model: mdl });
  } catch(e) {
    res.status(500).json({ success: false, error: e.message });
  }
}