import https from 'https';
import db from '../../../lib/db';

export default function handler(req, res) {
  const settings = db.getSettings();
  const apiKey = req.query.key || settings.gemini_api_key;
  if (!apiKey) return res.status(400).json({ success: false, error: 'Chưa cấu hình Gemini API Key' });
  const options = {
    hostname: 'generativelanguage.googleapis.com',
    port: 443,
    path: `/v1beta/models?key=${encodeURIComponent(apiKey)}`,
    method: 'GET'
  };
  const request = https.request(options, (response) => {
    let body = '';
    response.on('data', chunk => body += chunk);
    response.on('end', () => {
      try {
        const parsed = JSON.parse(body);
        if (response.statusCode >= 400) return res.status(response.statusCode).json({ success: false, error: parsed.error?.message });
        const models = (parsed.models || [])
          .filter(m => Array.isArray(m.supportedGenerationMethods) && m.supportedGenerationMethods.includes('generateContent'))
          .map(m => (m.name || '').replace(/^models\//, ''));
        res.status(200).json({ success: true, models });
      } catch (err) {
        res.status(500).json({ success: false, error: err.message });
      }
    });
  });
  request.on('error', e => res.status(500).json({ success: false, error: e.message }));
  request.end();
}