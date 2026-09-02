const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Default seed programs from original app
const DEFAULT_PROGRAMS = [
  {
    id: "prog_MH18",
    code: "MH18",
    name: "Kỹ thuật xử lý phim và kỹ xảo điện ảnh",
    totalHours: 75,
    version: "2026",
    lessons: [
      {
        title: "Bài 1: Một số chức năng cơ bản của phần mềm Adobe Premiere",
        hours: 3,
        sections: [
          {
            title: "1. Khởi tạo Project",
            items: [
              "1.1. Tạo một Project mới",
              "1.2. Import Video vào Project"
            ]
          },
          {
            title: "2. Một số thiết lập cho khu vực Preview và Timeline",
            items: [
              "2.1. Thiết lập khu vực Preview",
              "2.2. Thiết lập khu vực Timeline"
            ]
          },
          {
            title: "3. Thao tác cắt cúp Video trên Timeline",
            items: [
              "3.1. Chọn công cụ Razor Tool (phím C)",
              "3.2. Cắt bỏ đoạn video thừa"
            ]
          }
        ]
      },
      {
        title: "Bài 2: Sử dụng hiệu ứng chuyển cảnh và kỹ xảo cơ bản",
        hours: 4,
        sections: [
          {
            title: "1. Hiệu ứng chuyển cảnh Video Transitions",
            items: [
              "1.1. Thêm Dissolve vào giữa 2 clip",
              "1.2. Tinh chỉnh thời lượng chuyển cảnh"
            ]
          },
          {
            title: "2. Chèn chữ và tiêu đề cơ bản",
            items: [
              "2.1. Tạo Essential Graphics Title",
              "2.2. Chọn font, màu sắc và hiệu ứng chuyển động"
            ]
          }
        ]
      }
    ]
  },
  {
    id: "prog_MH01",
    code: "MH01",
    name: "Tin học văn phòng",
    totalHours: 45,
    version: "2026",
    lessons: [
      {
        title: "Bài 1: Soạn thảo văn bản nâng cao với Microsoft Word",
        hours: 3,
        sections: [
          {
            title: "1. Định dạng Style và Mục lục tự động",
            items: [
              "1.1. Thiết lập Heading 1, 2, 3 chuẩn Nghị định 30",
              "1.2. Tạo Table of Contents tự động"
            ]
          },
          {
            title: "2. Trộn thư Mail Merge",
            items: [
              "2.1. Chuẩn bị danh sách Excel",
              "2.2. Tiến hành trộn thư và in ấn"
            ]
          }
        ]
      }
    ]
  }
];

class JsonDatabase {
  constructor(dataDir) {
    this.dir = dataDir;
    this.files = {
      programs: path.join(dataDir, 'programs.json'),
      schedules: path.join(dataDir, 'schedules.json'),
      active_session: path.join(dataDir, 'active_session.json'),
      lesson_plans: path.join(dataDir, 'lesson_plans.json'),
      settings: path.join(dataDir, 'settings.json'),
      audit_logs: path.join(dataDir, 'audit_logs.json')
    };
    this.cache = {};
    this.init();
  }

  init() {
    // Initialize default tables
    if (!fs.existsSync(this.files.programs)) {
      this.writeFile('programs', DEFAULT_PROGRAMS);
    }
    if (!fs.existsSync(this.files.schedules)) {
      this.writeFile('schedules', []);
    }
    if (!fs.existsSync(this.files.active_session)) {
      this.writeFile('active_session', {});
    }
    if (!fs.existsSync(this.files.lesson_plans)) {
      this.writeFile('lesson_plans', []);
    }
    if (!fs.existsSync(this.files.settings)) {
      this.writeFile('settings', {
        gemini_api_key: "",
        gemini_model: "gemini-2.5-flash",
        lecturer_name: "Trần Hữu Nhân",
        department: "Khoa CNTT - KTĐ",
        college_name: "Trường Cao đẳng Bách khoa Nam Sài Gòn",
        academic_year: "2025 - 2026",
        semester: "Học kỳ 1"
      });
    }
    if (!fs.existsSync(this.files.audit_logs)) {
      this.writeFile('audit_logs', []);
    }
  }

  readFile(collection) {
    const file = this.files[collection];
    if (!file) throw new Error(`Unknown collection: ${collection}`);
    try {
      if (!fs.existsSync(file)) return collection === 'settings' || collection === 'active_session' ? {} : [];
      const content = fs.readFileSync(file, 'utf8');
      return JSON.parse(content || (collection === 'settings' || collection === 'active_session' ? '{}' : '[]'));
    } catch (e) {
      console.error(`Error reading ${collection}:`, e.message);
      return collection === 'settings' || collection === 'active_session' ? {} : [];
    }
  }

  writeFile(collection, data) {
    const file = this.files[collection];
    if (!file) throw new Error(`Unknown collection: ${collection}`);
    const tmp = file + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf8');
    fs.renameSync(tmp, file);
    this.cache[collection] = data;
  }

  // --- PROGRAMS ---
  getPrograms() {
    return this.readFile('programs');
  }

  getProgramById(id) {
    const list = this.getPrograms();
    return list.find(p => p.id === id || p.code === id) || null;
  }

  saveProgram(program) {
    const list = this.getPrograms();
    const now = new Date().toISOString();
    if (!program.id) {
      program.id = 'prog_' + (program.code ? program.code.replace(/\s+/g, '_') : Date.now());
    }
    const idx = list.findIndex(p => p.id === program.id || (program.code && p.code === program.code));
    if (idx >= 0) {
      program.updatedAt = now;
      list[idx] = { ...list[idx], ...program };
    } else {
      program.createdAt = now;
      program.updatedAt = now;
      list.push(program);
    }
    this.writeFile('programs', list);
    return program;
  }

  deleteProgram(id) {
    const list = this.getPrograms();
    const filtered = list.filter(p => p.id !== id && p.code !== id);
    this.writeFile('programs', filtered);
    return true;
  }

  // --- SCHEDULES ---
  getSchedules() {
    return this.readFile('schedules');
  }

  getScheduleById(id) {
    const list = this.getSchedules();
    return list.find(s => s.id === id) || null;
  }

  saveSchedule(sched) {
    const list = this.getSchedules();
    const now = new Date().toISOString();
    if (!sched.id) {
      sched.id = 'sched_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
      sched.createdAt = now;
    }
    sched.updatedAt = now;
    const idx = list.findIndex(s => s.id === sched.id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...sched };
    } else {
      list.push(sched);
    }
    this.writeFile('schedules', list);
    return sched;
  }

  deleteSchedule(id) {
    const list = this.getSchedules();
    const filtered = list.filter(s => s.id !== id);
    this.writeFile('schedules', filtered);
    return true;
  }

  // --- ACTIVE SESSION ---
  getActiveSession() {
    return this.readFile('active_session');
  }

  saveActiveSession(state) {
    const now = new Date().toISOString();
    state.updatedAt = now;
    this.writeFile('active_session', state);
    return state;
  }

  // --- LESSON PLANS (Phụ lục 10) ---
  getLessonPlans(query = {}) {
    const list = this.readFile('lesson_plans');
    let filtered = list;
    if (query.courseCode) {
      filtered = filtered.filter(lp => lp.courseCode === query.courseCode);
    }
    if (query.scheduleId) {
      filtered = filtered.filter(lp => lp.scheduleId === query.scheduleId);
    }
    if (query.sessionStt) {
      filtered = filtered.filter(lp => Number(lp.sessionStt) === Number(query.sessionStt));
    }
    return filtered;
  }

  getLessonPlanById(id) {
    const list = this.readFile('lesson_plans');
    return list.find(lp => lp.id === id) || null;
  }

  getLessonPlanBySession(scheduleId, sessionStt) {
    const list = this.readFile('lesson_plans');
    return list.find(lp => (lp.scheduleId === scheduleId || !scheduleId) && Number(lp.sessionStt) === Number(sessionStt)) || null;
  }

  saveLessonPlan(lp) {
    const list = this.readFile('lesson_plans');
    const now = new Date().toISOString();
    if (!lp.id) {
      const codePart = lp.courseCode ? lp.courseCode.replace(/[^a-zA-Z0-9]/g, '') : 'LP';
      const sttPart = lp.sessionStt ? 'b' + lp.sessionStt : 'p' + Date.now();
      lp.id = `lp_${codePart}_${sttPart}_${Date.now().toString(36)}`;
      lp.createdAt = now;
    }
    lp.updatedAt = now;
    const idx = list.findIndex(p => p.id === lp.id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...lp };
    } else {
      list.push(lp);
    }
    this.writeFile('lesson_plans', list);
    return lp;
  }

  deleteLessonPlan(id) {
    const list = this.readFile('lesson_plans');
    const filtered = list.filter(lp => lp.id !== id);
    this.writeFile('lesson_plans', filtered);
    return true;
  }

  // --- SETTINGS ---
  getSettings() {
    return this.readFile('settings');
  }

  saveSettings(newSettings) {
    const current = this.getSettings();
    const updated = { ...current, ...newSettings, updatedAt: new Date().toISOString() };
    this.writeFile('settings', updated);
    return updated;
  }

  // --- BACKUP & RESTORE ---
  getBackupData() {
    return {
      version: "2.0.0",
      exportedAt: new Date().toISOString(),
      programs: this.getPrograms(),
      schedules: this.getSchedules(),
      active_session: this.getActiveSession(),
      lesson_plans: this.readFile('lesson_plans'),
      settings: this.getSettings()
    };
  }

  restoreBackup(data) {
    if (!data || typeof data !== 'object') throw new Error('Dữ liệu sao lưu không hợp lệ');
    if (Array.isArray(data.programs)) this.writeFile('programs', data.programs);
    if (Array.isArray(data.schedules)) this.writeFile('schedules', data.schedules);
    if (data.active_session) this.writeFile('active_session', data.active_session);
    if (Array.isArray(data.lesson_plans)) this.writeFile('lesson_plans', data.lesson_plans);
    if (data.settings) this.writeFile('settings', data.settings);
    return { success: true, timestamp: new Date().toISOString() };
  }

  // --- STATS ---
  getStats() {
    const programs = this.getPrograms();
    const schedules = this.getSchedules();
    const lessonPlans = this.readFile('lesson_plans');
    let totalSessions = 0;
    schedules.forEach(s => {
      if (Array.isArray(s.sessions)) totalSessions += s.sessions.length;
    });
    return {
      totalPrograms: programs.length,
      totalSchedules: schedules.length,
      totalSessions,
      totalLessonPlans: lessonPlans.length
    };
  }
}

const db = new JsonDatabase(DATA_DIR);
module.exports = db;
