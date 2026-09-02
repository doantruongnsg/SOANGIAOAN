// ==========================================================
// MASTER APPLICATION ORCHESTRATOR
// ==========================================================

window.App = {
  currentTab: 'step1',

  async init() {
    // Initialize Schedule Module (Slots, Exclusions, Saved Sessions)
    if (typeof initSchedule === 'function') {
      initSchedule();
    } else if (window.ScheduleModule && window.ScheduleModule.renderWeeklySlots) {
      window.ScheduleModule.renderWeeklySlots();
      window.ScheduleModule.renderExclusions();
      window.ScheduleModule.renderSavedSessionList();
      window.ScheduleModule.updateWeeklyCheck();
    }
    console.log("Initializing Quản lý Sổ đầu bài & Soạn giáo án Web App v2.0...");
    
    // Check server connection
    try {
      await API.checkHealth();
      API.setSyncStatus('connected', 'Đã kết nối máy chủ');
    } catch (e) {
      API.setSyncStatus('error', 'Máy chủ ngoại tuyến');
    }

    // Initialize Submodules
    if (window.PlannerModule && window.PlannerModule.init) {
      await window.PlannerModule.init();
    }
    if (window.ScheduleModule && window.ScheduleModule.updateSavedSessionInfo) {
      await window.ScheduleModule.updateSavedSessionInfo();
    }

    // Load active session state if available
    try {
      const res = await API.getActiveState();
      if (res.data && res.data.course && window.ScheduleModule.applyWorkSessionState) {
        window.ScheduleModule.applyWorkSessionState(res.data);
        if (Array.isArray(res.data.sessions) && res.data.sessions.length > 0) {
          if (typeof buildSchedule === 'function') buildSchedule();
        }
      }
    } catch (e) {
      console.warn("Could not restore active session state:", e);
    }

    // Setup tab switching
    this.setupTabs();

    // Listen for custom dispatch events
    window.addEventListener("OPEN_LESSON_PLAN_FROM_SCHEDULE", (e) => {
      this.openLessonPlan(e.detail);
    });
  },

  setupTabs() {
    const pills = document.querySelectorAll('.step-pill');
    pills.forEach((pill, idx) => {
      pill.addEventListener('click', () => {
        const targetId = pill.dataset.target || (idx === 0 ? 'step1' : (idx === 1 ? 'step2' : 'dashboard'));
        this.switchTab(targetId);
      });
    });
  },

  switchTab(tabId) {
    this.currentTab = tabId;
    
    // Update pills active state
    document.querySelectorAll('.step-pill').forEach(pill => {
      if (pill.dataset.target === tabId) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });

    // Update sections visibility
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const dashboard = document.getElementById('dashboard');

    if (tabId === 'step1') {
      if (step1) step1.style.display = 'block';
      if (step2) step2.style.display = 'none';
      if (dashboard) dashboard.style.display = 'none';
    } else if (tabId === 'step2') {
      if (step1) step1.style.display = 'none';
      if (step2) step2.style.display = 'block';
      if (dashboard) dashboard.style.display = 'none';
    } else if (tabId === 'dashboard') {
      if (step1) step1.style.display = 'none';
      if (step2) step2.style.display = 'none';
      if (dashboard) dashboard.style.display = 'block';
      this.loadDashboardData();
    } else if (tabId === 'all') {
      if (step1) step1.style.display = 'block';
      if (step2) step2.style.display = 'block';
      if (dashboard) dashboard.style.display = 'none';
    }
  },

  // One-click workflow from SDB -> Lesson Planner
  openLessonPlan(payload) {
    const p = payload || {};
    const st = document.getElementById("transferStatus");
    if (st) {
      st.style.display = "block";
      st.innerHTML = `Đã chọn <b>${p.courseName || ""} – ${p.courseCode || ""}</b> · ${p.weekday || ""} ${p.date || ""} · ${p.periods || 0} tiết. Bước 2 sẽ khóa đúng Môn học – Mã môn này.`;
    }

    if (window.PlannerModule && window.PlannerModule.receiveScheduleSession) {
      window.PlannerModule.receiveScheduleSession(p);
    }

    // Switch to step 2 smoothly
    this.switchTab('step2');
    showToast(`Đã nạp buổi dạy ${p.scheduleTT || ""} vào Giáo án Phụ lục 10!`, "success");
    setTimeout(() => {
      const el = document.getElementById("step2");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
  },

  async loadDashboardData() {
    try {
      const statsRes = await API.getStats();
      const stats = statsRes.data || {};
      
      const sPrograms = document.getElementById('statPrograms');
      const sSchedules = document.getElementById('statSchedules');
      const sSessions = document.getElementById('statSessions');
      const sLessonPlans = document.getElementById('statLessonPlans');

      if (sPrograms) sPrograms.innerText = stats.totalPrograms || 0;
      if (sSchedules) sSchedules.innerText = stats.totalSchedules || 0;
      if (sSessions) sSessions.innerText = stats.totalSessions || 0;
      if (sLessonPlans) sLessonPlans.innerText = stats.totalLessonPlans || 0;

      // Load schedules table in dashboard
      const schedulesRes = await API.getSchedules();
      const schedList = schedulesRes.data || [];
      const schedTbody = document.getElementById('dashSchedulesTbody');
      if (schedTbody) {
        if (schedList.length === 0) {
          schedTbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#64748b;padding:16px;">Chưa có phiên Sổ đầu bài nào được lưu.</td></tr>';
        } else {
          schedTbody.innerHTML = schedList.map((s, idx) => `
            <tr>
              <td style="text-align:center;">${idx + 1}</td>
              <td><b>${s.name || 'Chưa đặt tên'}</b></td>
              <td>${s.course?.name || ''} (${s.course?.code || ''})</td>
              <td style="text-align:center;">${Array.isArray(s.sessions) ? s.sessions.length : 0} buổi</td>
              <td style="text-align:center;">
                <button onclick="App.openScheduleFromDash('${s.id}')" style="padding:4px 8px;font-size:12px;">Mở</button>
                <button onclick="App.deleteScheduleFromDash('${s.id}')" class="danger" style="padding:4px 8px;font-size:12px;">Xóa</button>
              </td>
            </tr>
          `).join('');
        }
      }

      // Load lesson plans table in dashboard
      const lpRes = await API.getLessonPlans();
      const lpList = lpRes.data || [];
      const lpTbody = document.getElementById('dashLessonPlansTbody');
      if (lpTbody) {
        if (lpList.length === 0) {
          lpTbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#64748b;padding:16px;">Chưa có giáo án Phụ lục 10 nào được lưu.</td></tr>';
        } else {
          lpTbody.innerHTML = lpList.map((lp, idx) => `
            <tr>
              <td style="text-align:center;">${idx + 1}</td>
              <td><b>${lp.lessonTitle || 'Chưa có tên bài'}</b></td>
              <td>${lp.courseName || ''} (${lp.courseCode || ''})</td>
              <td style="text-align:center;">${lp.periods || 0} tiết (${lp.minutes || 0}p)</td>
              <td style="text-align:center;">
                <button onclick="App.openLessonPlanFromDash('${lp.id}')" style="padding:4px 8px;font-size:12px;">Xem / Sửa</button>
                <button onclick="App.deleteLessonPlanFromDash('${lp.id}')" class="danger" style="padding:4px 8px;font-size:12px;">Xóa</button>
              </td>
            </tr>
          `).join('');
        }
      }

      // Load settings
      const setRes = await API.getSettings();
      const s = setRes.data || {};
      if (document.getElementById('setLecturerName')) document.getElementById('setLecturerName').value = s.lecturer_name || '';
      if (document.getElementById('setDepartment')) document.getElementById('setDepartment').value = s.department || '';
      if (document.getElementById('setCollege')) document.getElementById('setCollege').value = s.college_name || '';
      if (document.getElementById('setAcademicYear')) document.getElementById('setAcademicYear').value = s.academic_year || '';
      if (document.getElementById('setSemester')) document.getElementById('setSemester').value = s.semester || '';
    } catch (e) {
      console.error("Error loading dashboard data:", e);
    }
  },

  async openScheduleFromDash(id) {
    try {
      const res = await API.getSchedule(id);
      if (res.data) {
        window.ScheduleModule.applyWorkSessionState(res.data);
        if (Array.isArray(res.data.sessions) && res.data.sessions.length > 0) {
          if (typeof buildSchedule === 'function') buildSchedule();
        }
        this.switchTab('step1');
        showToast("Đã nạp phiên Sổ đầu bài!", "success");
      }
    } catch (e) {
      showToast("Lỗi mở phiên: " + e.message, "error");
    }
  },

  async deleteScheduleFromDash(id) {
    if (!confirm("Bạn có chắc chắn muốn xóa phiên Sổ đầu bài này?")) return;
    try {
      await API.deleteSchedule(id);
      showToast("Đã xóa phiên thành công.", "success");
      this.loadDashboardData();
    } catch (e) {
      showToast("Lỗi xóa: " + e.message, "error");
    }
  },

  async openLessonPlanFromDash(id) {
    try {
      const res = await API.getLessonPlan(id);
      if (res.data && res.data.htmlContent) {
        const paper = document.getElementById("paper");
        if (paper) paper.innerHTML = res.data.htmlContent;
        this.switchTab('step2');
        showToast("Đã tải giáo án!", "success");
      }
    } catch (e) {
      showToast("Lỗi mở giáo án: " + e.message, "error");
    }
  },

  async deleteLessonPlanFromDash(id) {
    if (!confirm("Bạn có chắc chắn muốn xóa giáo án này?")) return;
    try {
      await API.deleteLessonPlan(id);
      showToast("Đã xóa giáo án thành công.", "success");
      this.loadDashboardData();
    } catch (e) {
      showToast("Lỗi xóa: " + e.message, "error");
    }
  },

  async saveProfileSettings() {
    const payload = {
      lecturer_name: document.getElementById('setLecturerName')?.value || '',
      department: document.getElementById('setDepartment')?.value || '',
      college_name: document.getElementById('setCollege')?.value || '',
      academic_year: document.getElementById('setAcademicYear')?.value || '',
      semester: document.getElementById('setSemester')?.value || ''
    };
    try {
      await API.saveSettings(payload);
      showToast("Đã lưu thông tin giảng viên & trường thành công!", "success");
    } catch (e) {
      showToast("Lỗi lưu cài đặt: " + e.message, "error");
    }
  }
};

document.addEventListener("DOMContentLoaded", () => {
  window.App.init();
});
