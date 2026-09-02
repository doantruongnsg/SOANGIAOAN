const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const mammoth = require('mammoth');
const https = require('https');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Multer storage in memory for uploaded docx
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }
});

// Helper for Gemini API calls
function callGeminiApi(apiKey, model, prompt) {
  return new Promise((resolve, reject) => {
    const cleanModel = model || 'gemini-2.5-flash';
    const postData = JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048
      }
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

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (res.statusCode >= 400) {
            return reject(new Error(parsed.error?.message || `Gemini API HTTP ${res.statusCode}`));
          }
          const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text || '';
          resolve({ text, raw: parsed });
        } catch (e) {
          reject(new Error(`Lỗi phản hồi từ Gemini: ${e.message}`));
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// ==================== REST API ENDPOINTS ====================

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString(), version: '2.0.0' });
});

// 2. Stats
app.get('/api/stats', (req, res) => {
  try {
    const stats = db.getStats();
    res.json({ success: true, data: stats });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// 3. Settings
app.get('/api/settings', (req, res) => {
  try {
    const settings = db.getSettings();
    res.json({ success: true, data: settings });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

app.post('/api/settings', (req, res) => {
  try {
    const saved = db.saveSettings(req.body);
    res.json({ success: true, data: saved });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// 4. Programs (Chương trình môn học)
app.get('/api/programs', (req, res) => {
  try {
    const list = db.getPrograms();
    res.json({ success: true, data: list });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

app.get('/api/programs/:id', (req, res) => {
  try {
    const prog = db.getProgramById(req.params.id);
    if (!prog) return res.status(404).json({ success: false, error: 'Không tìm thấy chương trình môn học' });
    res.json({ success: true, data: prog });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

app.post('/api/programs', (req, res) => {
  try {
    const saved = db.saveProgram(req.body);
    res.json({ success: true, data: saved });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

app.put('/api/programs/:id', (req, res) => {
  try {
    const data = { ...req.body, id: req.params.id };
    const saved = db.saveProgram(data);
    res.json({ success: true, data: saved });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

app.delete('/api/programs/:id', (req, res) => {
  try {
    db.deleteProgram(req.params.id);
    res.json({ success: true, message: 'Đã xóa chương trình' });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// 5. Schedules (Sổ đầu bài)
app.get('/api/schedules', (req, res) => {
  try {
    const list = db.getSchedules();
    res.json({ success: true, data: list });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

app.get('/api/schedules/:id', (req, res) => {
  try {
    const sched = db.getScheduleById(req.params.id);
    if (!sched) return res.status(404).json({ success: false, error: 'Không tìm thấy phiên Sổ đầu bài' });
    res.json({ success: true, data: sched });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

app.post('/api/schedules', (req, res) => {
  try {
    const saved = db.saveSchedule(req.body);
    res.json({ success: true, data: saved });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

app.put('/api/schedules/:id', (req, res) => {
  try {
    const data = { ...req.body, id: req.params.id };
    const saved = db.saveSchedule(data);
    res.json({ success: true, data: saved });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

app.delete('/api/schedules/:id', (req, res) => {
  try {
    db.deleteSchedule(req.params.id);
    res.json({ success: true, message: 'Đã xóa phiên Sổ đầu bài' });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// 6. Active Session State
app.get('/api/schedules/active/state', (req, res) => {
  try {
    const state = db.getActiveSession();
    res.json({ success: true, data: state });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

app.post('/api/schedules/active/state', (req, res) => {
  try {
    const saved = db.saveActiveSession(req.body);
    res.json({ success: true, data: saved });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// 7. Lesson Plans (Giáo án Phụ lục 10)
app.get('/api/lesson-plans', (req, res) => {
  try {
    const list = db.getLessonPlans(req.query);
    res.json({ success: true, data: list });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

app.get('/api/lesson-plans/:id', (req, res) => {
  try {
    const lp = db.getLessonPlanById(req.params.id);
    if (!lp) return res.status(404).json({ success: false, error: 'Không tìm thấy giáo án' });
    res.json({ success: true, data: lp });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

app.get('/api/lesson-plans/session/:scheduleId/:sessionStt', (req, res) => {
  try {
    const lp = db.getLessonPlanBySession(req.params.scheduleId, req.params.sessionStt);
    res.json({ success: true, data: lp });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

app.post('/api/lesson-plans', (req, res) => {
  try {
    const saved = db.saveLessonPlan(req.body);
    res.json({ success: true, data: saved });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

app.put('/api/lesson-plans/:id', (req, res) => {
  try {
    const data = { ...req.body, id: req.params.id };
    const saved = db.saveLessonPlan(data);
    res.json({ success: true, data: saved });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

app.delete('/api/lesson-plans/:id', (req, res) => {
  try {
    db.deleteLessonPlan(req.params.id);
    res.json({ success: true, message: 'Đã xóa giáo án' });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// 8. DOCX Syllabus Upload & Parser
app.post('/api/upload-syllabus', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: 'Chưa tải lên file docx' });
    
    const result = await mammoth.convertToHtml({ buffer: req.file.buffer });
    const rawText = await mammoth.extractRawText({ buffer: req.file.buffer });
    
    res.json({
      success: true,
      filename: req.file.originalname,
      html: result.value,
      text: rawText.value,
      messages: result.messages
    });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Lỗi đọc file Word: ' + e.message });
  }
});

// 9. AI Proxy & Models
app.get('/api/ai/models', async (req, res) => {
  try {
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
          if (response.statusCode >= 400) {
            return res.status(response.statusCode).json({ success: false, error: parsed.error?.message || 'Lỗi lấy models' });
          }
          const models = (parsed.models || [])
            .filter(m => Array.isArray(m.supportedGenerationMethods) && m.supportedGenerationMethods.includes('generateContent'))
            .map(m => (m.name || '').replace(/^models\//, ''));
          res.json({ success: true, models, raw: parsed.models });
        } catch (err) {
          res.status(500).json({ success: false, error: err.message });
        }
      });
    });

    request.on('error', (e) => res.status(500).json({ success: false, error: e.message }));
    request.end();
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

app.post('/api/ai/generate', async (req, res) => {
  try {
    const { prompt, model, apiKey } = req.body;
    const settings = db.getSettings();
    const key = apiKey || settings.gemini_api_key;
    const mdl = model || settings.gemini_model || 'gemini-2.5-flash';

    if (!key) {
      return res.status(400).json({ success: false, error: 'Vui lòng cung cấp hoặc cấu hình Gemini API Key' });
    }
    if (!prompt) {
      return res.status(400).json({ success: false, error: 'Prompt không được để trống' });
    }

    const result = await callGeminiApi(key, mdl, prompt);
    res.json({ success: true, text: result.text, model: mdl });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// 10. Backup & Restore
app.get('/api/backup', (req, res) => {
  try {
    const backup = db.getBackupData();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="BKNSG_GiaoAn_Backup_${new Date().toISOString().slice(0, 10)}.json"`);
    res.json(backup);
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

app.post('/api/restore', (req, res) => {
  try {
    const result = db.restoreBackup(req.body);
    res.json({ success: true, message: 'Đã khôi phục dữ liệu thành công', data: result });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// Catch all route to serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`======================================================`);
  console.log(`  QUẢN LÝ SỔ ĐẦU BÀI & SOẠN GIÁO ÁN (BKNSG v2.0)`);
  console.log(`  Server đang chạy tại: http://localhost:${PORT}`);
  console.log(`======================================================`);
});
