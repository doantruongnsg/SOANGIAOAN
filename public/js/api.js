// ==========================================================
// REST API CLIENT & BACKEND SYNC
// ==========================================================

const API = {
  baseUrl: '',

  async request(endpoint, options = {}) {
    try {
      this.setSyncStatus('syncing', 'Đang đồng bộ...');
      const res = await fetch(this.baseUrl + endpoint, {
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {})
        },
        ...options
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || `HTTP ${res.statusCode}`);
      }
      this.setSyncStatus('connected', 'Đã lưu máy chủ');
      return data;
    } catch (err) {
      console.error(`API Error [${endpoint}]:`, err);
      this.setSyncStatus('error', 'Lỗi kết nối máy chủ');
      throw err;
    }
  },

  setSyncStatus(status, text) {
    const badge = document.getElementById('serverSyncBadge');
    if (!badge) return;
    badge.className = `server-badge ${status}`;
    const label = badge.querySelector('.sync-text') || badge;
    label.innerHTML = `<span class="dot"></span> ${text}`;
  },

  // Health
  checkHealth() {
    return this.request('/api/health');
  },

  // Stats
  getStats() {
    return this.request('/api/stats');
  },

  // Settings
  getSettings() {
    return this.request('/api/settings');
  },
  saveSettings(data) {
    return this.request('/api/settings', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // Programs
  getPrograms() {
    return this.request('/api/programs');
  },
  getProgram(id) {
    return this.request(`/api/programs/${encodeURIComponent(id)}`);
  },
  saveProgram(data) {
    return this.request('/api/programs', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  deleteProgram(id) {
    return this.request(`/api/programs/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
  },

  // Schedules (Sổ đầu bài)
  getSchedules() {
    return this.request('/api/schedules');
  },
  getSchedule(id) {
    return this.request(`/api/schedules/${encodeURIComponent(id)}`);
  },
  saveSchedule(data) {
    return this.request('/api/schedules', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  deleteSchedule(id) {
    return this.request(`/api/schedules/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
  },

  // Active Session State
  getActiveState() {
    return this.request('/api/schedules/active/state');
  },
  saveActiveState(state) {
    return this.request('/api/schedules/active/state', {
      method: 'POST',
      body: JSON.stringify(state)
    });
  },

  // Lesson Plans (Phụ lục 10)
  getLessonPlans(query = {}) {
    const params = new URLSearchParams(query).toString();
    return this.request(`/api/lesson-plans${params ? '?' + params : ''}`);
  },
  getLessonPlan(id) {
    return this.request(`/api/lesson-plans/${encodeURIComponent(id)}`);
  },
  getLessonPlanBySession(scheduleId, sessionStt) {
    return this.request(`/api/lesson-plans/session/${encodeURIComponent(scheduleId || 'none')}/${encodeURIComponent(sessionStt)}`);
  },
  saveLessonPlan(data) {
    return this.request('/api/lesson-plans', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  deleteLessonPlan(id) {
    return this.request(`/api/lesson-plans/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
  },

  // AI Generation & Models
  getAiModels(apiKey = '') {
    return this.request(`/api/ai/models${apiKey ? '?key=' + encodeURIComponent(apiKey) : ''}`);
  },
  generateAI(prompt, model = '', apiKey = '') {
    return this.request('/api/ai/generate', {
      method: 'POST',
      body: JSON.stringify({ prompt, model, apiKey })
    });
  },

  // DOCX Syllabus upload
  async uploadSyllabus(file) {
    this.setSyncStatus('syncing', 'Đang đọc file Word...');
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/upload-syllabus', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Lỗi tải file');
    this.setSyncStatus('connected', 'Đã đọc file Word');
    return data;
  },

  // Backup & Restore
  backup() {
    window.location.href = '/api/backup';
  },
  restore(backupData) {
    return this.request('/api/restore', {
      method: 'POST',
      body: JSON.stringify(backupData)
    });
  }
};

// UI Toast helper
function showToast(msg, type = 'info') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = msg;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 200);
  }, 3500);
}
