const http = require('http');
const assert = require('assert');
const path = require('path');
const { spawn } = require('child_process');

const BASE_URL = 'http://localhost:3000';

function makeRequest(method, reqPath, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + reqPath);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runTests() {
  console.log("=== STARTING FULL BACKEND API & DATA FLOW TESTS ===");

  // 1. Health Check
  console.log("\n1. Testing GET /api/health...");
  const health = await makeRequest('GET', '/api/health');
  assert.strictEqual(health.status, 200);
  assert.strictEqual(health.data.status, 'ok');
  console.log(" -> PASS: Health check is OK (Version " + health.data.version + ")");

  // 2. Database direct & API Programs
  console.log("\n2. Testing Programs API (GET & POST)...");
  const progs = await makeRequest('GET', '/api/programs');
  assert.strictEqual(progs.status, 200);
  assert(Array.isArray(progs.data.data), "Programs data should be an array");
  console.log(" -> PASS: Retrieved " + progs.data.data.length + " default programs");

  const testProg = {
    code: "MH_TEST",
    name: "Môn học kiểm thử tự động",
    totalHours: 30,
    version: "2026",
    lessons: [{ title: "Bài 1: Tổng quan", hours: 3 }]
  };
  const createProg = await makeRequest('POST', '/api/programs', testProg);
  assert.strictEqual(createProg.status, 200);
  assert.strictEqual(createProg.data.data.code, "MH_TEST");
  console.log(" -> PASS: Created test program with ID: " + createProg.data.data.id);

  // 3. Schedules (Sổ đầu bài) API
  console.log("\n3. Testing Schedules (Sổ đầu bài) API...");
  const testSched = {
    name: "Lịch giảng dạy K18 CNTT",
    courseMode: "tich_hop",
    course: { name: "Môn học kiểm thử", code: "MH_TEST", totalHours: 30 },
    startDate: "2026-09-10",
    weeklyCount: 2,
    weeklySlots: [{ day: 2, periods: 4 }, { day: 5, periods: 4 }],
    exclusions: [],
    sessions: [
      { stt: 1, weekday: "Thứ 3", date: "10/09/2026", periods: 4, type: "TH", content: "Bài 1: Cài đặt môi trường" },
      { stt: 2, weekday: "Thứ 6", date: "13/09/2026", periods: 4, type: "TH", content: "Bài 2: Thực hành cơ bản" }
    ]
  };
  const createSched = await makeRequest('POST', '/api/schedules', testSched);
  assert.strictEqual(createSched.status, 200);
  const schedId = createSched.data.data.id;
  assert(schedId, "Schedule should have an ID");
  console.log(" -> PASS: Saved schedule session with ID: " + schedId);

  // 4. Lesson Plans (Phụ lục 10) Workflow API
  console.log("\n4. Testing Lesson Plans (Phụ lục 10) API & Workflow linking...");
  const testLp = {
    scheduleId: schedId,
    sessionStt: 1,
    courseCode: "MH_TEST",
    courseName: "Môn học kiểm thử",
    lessonTitle: "Bài 1: Cài đặt môi trường",
    periods: 4,
    minutes: 180,
    lessonType: "practical",
    objectives: {
      knowledge: "Hiểu cấu trúc hệ thống",
      skills: "Cài đặt thành thạo môi trường",
      autonomy: "Ý thức tự giác thực hành"
    },
    htmlContent: "<div>Nội dung giáo án mẫu</div>"
  };
  const saveLp = await makeRequest('POST', '/api/lesson-plans', testLp);
  assert.strictEqual(saveLp.status, 200);
  assert.strictEqual(saveLp.data.data.courseCode, "MH_TEST");
  console.log(" -> PASS: Created linked Lesson Plan for session 1: " + saveLp.data.data.id);

  // Query by session
  const getBySession = await makeRequest('GET', `/api/lesson-plans/session/${schedId}/1`);
  assert.strictEqual(getBySession.status, 200);
  assert.strictEqual(getBySession.data.data.sessionStt, 1);
  console.log(" -> PASS: Retrieved lesson plan by scheduleId and sessionStt successfully");

  // 5. Settings API
  console.log("\n5. Testing Settings API...");
  const settings = await makeRequest('GET', '/api/settings');
  assert.strictEqual(settings.status, 200);
  assert(settings.data.data.lecturer_name, "Settings should have lecturer name");
  console.log(" -> PASS: Retrieved system settings (Lecturer: " + settings.data.data.lecturer_name + ")");

  // 6. Stats API
  console.log("\n6. Testing Stats API...");
  const stats = await makeRequest('GET', '/api/stats');
  assert.strictEqual(stats.status, 200);
  assert(stats.data.data.totalSchedules >= 1, "Should have at least 1 schedule");
  assert(stats.data.data.totalLessonPlans >= 1, "Should have at least 1 lesson plan");
  console.log(" -> PASS: Stats overview: ", stats.data.data);

  // 7. Clean up test records
  console.log("\n7. Cleaning up test records...");
  await makeRequest('DELETE', `/api/programs/${createProg.data.data.id}`);
  await makeRequest('DELETE', `/api/schedules/${schedId}`);
  await makeRequest('DELETE', `/api/lesson-plans/${saveLp.data.data.id}`);
  console.log(" -> PASS: Cleaned up temporary test records");

  console.log("\n=======================================================");
  console.log("  ALL TESTS PASSED SUCCESSFULLY (100% PASS)!");
  console.log("=======================================================");
}

// Check if server is already running
makeRequest('GET', '/api/health').then(() => {
  console.log("Existing server detected on port 3000. Running tests directly...");
  runTests().then(() => process.exit(0)).catch(err => {
    console.error("TEST FAILED:", err);
    process.exit(1);
  });
}).catch(() => {
  console.log("Starting server for tests...");
  const serverProcess = spawn('node', ['server.js'], { cwd: path.join(__dirname, '..') });
  serverProcess.stdout.on('data', (data) => {
    const str = data.toString();
    if (str.includes('Server đang chạy tại')) {
      runTests().then(() => {
        serverProcess.kill();
        process.exit(0);
      }).catch(err => {
        console.error("TEST FAILED:", err);
        serverProcess.kill();
        process.exit(1);
      });
    }
  });
});
