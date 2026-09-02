"use client";

import { useEffect, useRef, useState } from "react";
import AuthScreen from "./AuthScreen";
import { AuthService } from "../lib/auth";
import { UserSyncService } from "../lib/user-sync";

export default function MainAppShell() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [userDropdown, setUserDropdown] = useState(false);

  const plannerRef = useRef(null);
  const scheduleRef = useRef(null);
  const step2Ref = useRef(null);
  
  const [activeTab, setActiveTab] = useState("step1");
  const [transfer, setTransfer] = useState(null);
  const [scheduleHeight, setScheduleHeight] = useState(2400);
  const [plannerHeight, setPlannerHeight] = useState(2800);
  const [stats, setStats] = useState({ totalPrograms: 0, totalSchedules: 0, totalSessions: 0, totalLessonPlans: 0 });
  const [schedulesList, setSchedulesList] = useState([]);
  const [lessonPlansList, setLessonPlansList] = useState([]);
  const [serverStatus, setServerStatus] = useState("connecting");

  // Auth State Listener
  useEffect(() => {
    const unsubscribe = AuthService.onAuthChange((user) => {
      setCurrentUser(user);
      setAuthLoading(false);
      if (user) {
        // Load per-user data from Firestore
        loadUserCloudData(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  // Check server health
  useEffect(() => {
    fetch("/api/health")
      .then(res => res.json())
      .then(data => {
        if (data.status === "ok" || data.ok) setServerStatus("online");
        else setServerStatus("error");
      })
      .catch(() => setServerStatus("offline"));

    // Listen for iframe communications and auto-height adjustments
    const handler = (e) => {
      if (e.data?.type === "OPEN_LESSON_PLAN_FROM_SCHEDULE") {
        const p = e.data.payload || {};
        setTransfer(p);
        
        // Forward to planner iframe
        plannerRef.current?.contentWindow?.postMessage(
          { type: "LOAD_SCHEDULE_SESSION", payload: p },
          "*"
        );
        
        // Switch tab smoothly to Step 2
        setActiveTab("step2");
        setTimeout(() => {
          step2Ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 150);
      } else if (e.data?.type === "SCHEDULE_FRAME_HEIGHT") {
        if (e.data.height && e.data.height > 600) {
          setScheduleHeight(e.data.height + 40);
        }
      } else if (e.data?.type === "PLANNER_FRAME_HEIGHT") {
        if (e.data.height && e.data.height > 600) {
          setPlannerHeight(e.data.height + 40);
        }
      } else if (e.data?.type === "USER_SAVE_SCHEDULE") {
        if (currentUser?.uid && e.data.payload) {
          UserSyncService.saveSchedule(currentUser.uid, e.data.payload)
            .then(() => loadUserCloudData(currentUser.uid))
            .catch(err => console.warn("Auto save schedule cloud error:", err));
        }
      } else if (e.data?.type === "USER_SAVE_LESSON_PLAN") {
        if (currentUser?.uid && e.data.payload) {
          UserSyncService.saveLessonPlan(currentUser.uid, e.data.payload)
            .then(() => loadUserCloudData(currentUser.uid))
            .catch(err => console.warn("Auto save lesson plan cloud error:", err));
        }
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  const loadUserCloudData = async (uid) => {
    if (!uid) return;
    try {
      const [userScheds, userPlans, statsRes] = await Promise.all([
        UserSyncService.getSchedules(uid),
        UserSyncService.getLessonPlans(uid),
        fetch("/api/stats").then(r => r.json()).catch(() => ({ success: false }))
      ]);

      if (userScheds.length > 0) setSchedulesList(userScheds);
      if (userPlans.length > 0) setLessonPlansList(userPlans);
      
      if (statsRes && statsRes.success) {
        setStats({
          ...statsRes.data,
          totalSchedules: userScheds.length || statsRes.data.totalSchedules,
          totalLessonPlans: userPlans.length || statsRes.data.totalLessonPlans
        });
      }
    } catch (e) {
      console.warn("Could not load per-user cloud data:", e);
    }
  };

  const loadDashboardData = async () => {
    try {
      if (currentUser?.uid) {
        await loadUserCloudData(currentUser.uid);
      } else {
        const [statsRes, schedRes, lpRes] = await Promise.all([
          fetch("/api/stats").then(r => r.json()),
          fetch("/api/schedules").then(r => r.json()),
          fetch("/api/lesson-plans").then(r => r.json())
        ]);
        if (statsRes.success) setStats(statsRes.data);
        if (schedRes.success) setSchedulesList(schedRes.data || []);
        if (lpRes.success) setLessonPlansList(lpRes.data || []);
      }
    } catch (e) {
      console.error("Error loading dashboard data:", e);
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (tabId === "dashboard") {
      loadDashboardData();
    }
  };

  const handleSignOut = async () => {
    await AuthService.signOut();
    setCurrentUser(null);
    setUserDropdown(false);
  };

  // Loading spinner while checking auth
  if (authLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at 10% 20%, #e0edff 0%, #f0f7ff 40%, #f8fafc 90%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#1e293b',
        fontFamily: '"Plus Jakarta Sans", sans-serif'
      }}>
        <div style={{
          width: 80,
          height: 80,
          borderRadius: 20,
          background: 'linear-gradient(135deg, #16469d 0%, #1a56db 100%)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 32,
          fontWeight: 900,
          boxShadow: '0 10px 25px rgba(26, 86, 219, 0.3)',
          marginBottom: 18
        }}>NSG</div>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#1e3a8a' }}>Đang khởi tạo phiên làm việc Bách khoa Nam Sài Gòn...</div>
      </div>
    );
  }

  // If not logged in -> Show X Authentication Screen
  if (!currentUser) {
    return <AuthScreen onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  return (
    <main className="md-shell">
      {/* MATERIAL 3 TOP APP BAR & HERO */}
      <header className="md-hero">
        <div className="md-hero-content">
          <div className="md-hero-top-row">
            <div className="md-hero-badge">
              <span className="material-symbols-outlined">school</span>
              <span>Trường Cao đẳng Bách khoa Nam Sài Gòn · Khoa CNTT - KTĐ</span>
            </div>

            {/* USER PROFILE & LOGOUT CORNER */}
            <div className="md-user-profile-box">
              <div 
                className="user-pill" 
                onClick={() => setUserDropdown(!userDropdown)}
              >
                <div className="user-avatar">
                  {currentUser.photoURL ? (
                    <img src={currentUser.photoURL} alt="Avatar" />
                  ) : (
                    <span>{(currentUser.displayName || currentUser.email || 'G')[0].toUpperCase()}</span>
                  )}
                </div>
                <div className="user-info-text">
                  <span className="user-name">{currentUser.displayName || 'Giảng viên'}</span>
                  <span className="user-email">{currentUser.email || (currentUser.isGuest ? 'Khách trải nghiệm' : '')}</span>
                </div>
                <span className="material-symbols-outlined dropdown-arrow">
                  {userDropdown ? 'expand_less' : 'expand_more'}
                </span>
              </div>

              {/* DROPDOWN MENU */}
              {userDropdown && (
                <div className="user-dropdown-menu">
                  <div className="dropdown-header">
                    <b>{currentUser.displayName || 'Giảng viên'}</b>
                    <div className="small-email">{currentUser.email}</div>
                    <div className="user-badge-tag">
                      {currentUser.isGuest ? '⚡ Chế độ Khách' : '☁️ Đã kết nối Firebase Cloud'}
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item" onClick={() => { setActiveTab('dashboard'); setUserDropdown(false); }}>
                    <span className="material-symbols-outlined">dataset</span>
                    <span>Quản lý CSDL cá nhân</span>
                  </button>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item logout" onClick={handleSignOut}>
                    <span className="material-symbols-outlined">logout</span>
                    <span>Đăng xuất tài khoản</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <h1 className="md-hero-title">
            QUẢN LÝ SỔ ĐẦU BÀI & SOẠN GIÁO ÁN
          </h1>
          <p className="md-hero-sub">
            Hệ thống phân bổ lịch dạy tự động & Soạn giáo án <b>Mẫu Phụ lục 10</b> đạt chuẩn quy định · Giảng viên: <b>{currentUser.displayName || 'Trần Hữu Nhân'}</b>
          </p>

          {/* MATERIAL 3 NAVIGATION SEGMENTED TABS */}
          <div className="md-tabs">
            <button
              className={`md-tab ${activeTab === "step1" ? "active" : ""}`}
              onClick={() => handleTabChange("step1")}
            >
              <span className="material-symbols-outlined">calendar_month</span>
              <span>BƯỚC 1 · Lập Sổ đầu bài</span>
            </button>
            <button
              className={`md-tab ${activeTab === "step2" ? "active" : ""}`}
              onClick={() => handleTabChange("step2")}
            >
              <span className="material-symbols-outlined">edit_document</span>
              <span>BƯỚC 2 · Soạn giáo án (Phụ lục 10)</span>
            </button>
            <button
              className={`md-tab ${activeTab === "dashboard" ? "active" : ""}`}
              onClick={() => handleTabChange("dashboard")}
            >
              <span className="material-symbols-outlined">dataset</span>
              <span>BƯỚC 3 · Quản lý & CSDL</span>
            </button>
            <button
              className={`md-tab ${activeTab === "all" ? "active" : ""}`}
              onClick={() => handleTabChange("all")}
            >
              <span className="material-symbols-outlined">view_agenda</span>
              <span>👁 Xem song song</span>
            </button>
          </div>
        </div>

        <div className="md-server-status">
          <span className={`status-dot ${serverStatus}`}></span>
          <span>{serverStatus === "online" ? "Máy chủ Next.js Sẵn sàng" : serverStatus === "connecting" ? "Đang kết nối..." : "Máy chủ Ngoại tuyến"}</span>
        </div>
      </header>

      {/* TRANSFER STATUS ALERT BANNER */}
      {transfer && (
        <div className="md-transfer-banner">
          <div className="transfer-left">
            <span className="material-symbols-outlined check-icon">check_circle</span>
            <div>
              <div className="transfer-title">Đã tiếp nhận buổi học từ Sổ đầu bài thành công!</div>
              <div className="transfer-desc">
                Môn: <b>{transfer.courseName || ""}</b> ({transfer.courseCode || ""}) · <b>{transfer.weekday || ""}</b> {transfer.date || ""} · <b>{transfer.periods || 0} tiết</b> ({transfer.periods ? transfer.periods * 45 : 0} phút) · Giáo án số <b>{transfer.scheduleTT || "01"}</b>
              </div>
            </div>
          </div>
          <button className="md-btn-sm" onClick={() => handleTabChange("step2")}>
            Đến trình soạn thảo Phụ lục 10 →
          </button>
        </div>
      )}

      {/* BƯỚC 1: SỔ ĐẦU BÀI */}
      <section
        className="md-section"
        id="step1"
        style={{ display: activeTab === "step1" || activeTab === "all" ? "block" : "none" }}
      >
        <div className="md-section-head">
          <div className="head-info">
            <div className="step-badge">BƯỚC 1</div>
            <div>
              <h2>LẬP SỔ ĐẦU BÀI TỪ CHƯƠNG TRÌNH MÔN HỌC</h2>
              <p>Tải file chương trình (.docx), thiết lập lịch dạy trong tuần và chia tiết tự động.</p>
            </div>
          </div>
        </div>
        <div className="md-workflow-note">
          <span className="material-symbols-outlined">info</span>
          <div>
            <b>Quy trình tự động:</b> Chương trình môn học → Chia lịch theo đúng thứ & số tiết → Sổ đầu bài → Bấm <b>“SOẠN GIÁO ÁN BUỔI NÀY”</b> tại từng dòng để tự động nạp sang Bước 2.
          </div>
        </div>
        <iframe
          ref={scheduleRef}
          id="scheduleFrame"
          title="Lập Sổ đầu bài"
          src="/frames/schedule.html"
          style={{ height: `${scheduleHeight}px` }}
        />
      </section>

      {/* BƯỚC 2: SOẠN GIÁO ÁN */}
      <section
        className="md-section"
        id="step2"
        ref={step2Ref}
        style={{ display: activeTab === "step2" || activeTab === "all" ? "block" : "none" }}
      >
        <div className="md-section-head">
          <div className="head-info">
            <div className="step-badge">BƯỚC 2</div>
            <div>
              <h2>SOẠN GIÁO ÁN THEO TỪNG BUỔI (MẪU PHỤ LỤC 10)</h2>
              <p>Khóa chính xác môn học, mã môn, ngày dạy, số tiết, bài học trước từ SĐB và trợ lý AI Gemini.</p>
            </div>
          </div>
          <button className="md-btn-outline" onClick={() => handleTabChange("step1")}>
            <span className="material-symbols-outlined">arrow_upward</span>
            Quay lại Sổ đầu bài
          </button>
        </div>

        <iframe
          ref={plannerRef}
          id="plannerFrame"
          title="Soạn giáo án"
          src="/frames/planner.html"
          style={{ height: `${plannerHeight}px` }}
        />
      </section>

      {/* BƯỚC 3: DASHBOARD & CSDL */}
      <section
        className="md-section"
        id="dashboard"
        style={{ display: activeTab === "dashboard" ? "block" : "none" }}
      >
        <div className="md-section-head">
          <div className="head-info">
            <div className="step-badge">BƯỚC 3</div>
            <div>
              <h2>TRUNG TÂM QUẢN LÝ DỮ LIỆU CÁ NHÂN & CƠ SỞ DỮ LIỆU</h2>
              <p>Dữ liệu được lưu trữ & đồng bộ riêng cho giảng viên: <b>{currentUser.email}</b></p>
            </div>
          </div>
          <div className="actions">
            <a href="/api/backup" className="md-btn-primary" download>
              <span className="material-symbols-outlined">download</span>
              Tải sao lưu CSDL (.JSON)
            </a>
          </div>
        </div>

        <div className="md-dash-body">
          {/* KPI CARDS */}
          <div className="md-kpi-grid">
            <div className="md-kpi-card">
              <div className="kpi-icon blue"><span className="material-symbols-outlined">menu_book</span></div>
              <div className="kpi-data">
                <div className="kpi-value">{stats.totalPrograms || 2}</div>
                <div className="kpi-label">Chương trình môn học</div>
              </div>
            </div>
            <div className="md-kpi-card">
              <div className="kpi-icon green"><span className="material-symbols-outlined">event_note</span></div>
              <div className="kpi-data">
                <div className="kpi-value">{schedulesList.length || stats.totalSchedules || 0}</div>
                <div className="kpi-label">Phiên Sổ đầu bài cá nhân</div>
              </div>
            </div>
            <div className="md-kpi-card">
              <div className="kpi-icon purple"><span className="material-symbols-outlined">assignment</span></div>
              <div className="kpi-data">
                <div className="kpi-value">{lessonPlansList.length || stats.totalLessonPlans || 0}</div>
                <div className="kpi-label">Giáo án Phụ lục 10 cá nhân</div>
              </div>
            </div>
            <div className="md-kpi-card">
              <div className="kpi-icon orange"><span className="material-symbols-outlined">cloud_done</span></div>
              <div className="kpi-data">
                <div className="kpi-value">Đã đồng bộ</div>
                <div className="kpi-label">Firebase Cloud Firestore</div>
              </div>
            </div>
          </div>

          {/* TABLES */}
          <div className="md-card">
            <h3 className="card-title">
              <span className="material-symbols-outlined">table_chart</span>
              Danh sách Sổ đầu bài của bạn ({currentUser.email})
            </h3>
            <div className="table-responsive">
              <table className="md-table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Tên phiên làm việc</th>
                    <th>Môn học - Mã môn</th>
                    <th>Số buổi</th>
                    <th>Ngày cập nhật</th>
                  </tr>
                </thead>
                <tbody>
                  {schedulesList.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="empty-cell">Chưa có phiên Sổ đầu bài nào được lưu cho tài khoản này.</td>
                    </tr>
                  ) : (
                    schedulesList.map((item, idx) => (
                      <tr key={item.id || idx}>
                        <td>{idx + 1}</td>
                        <td><b>{item.name || "Phiên làm việc"}</b></td>
                        <td>{item.course?.name || "—"} ({item.course?.code || "—"})</td>
                        <td>{Array.isArray(item.sessions) ? item.sessions.length : 0} buổi</td>
                        <td>{item.updatedAt?.toDate ? item.updatedAt.toDate().toLocaleDateString("vi-VN") : (item.createdAt ? new Date(item.createdAt).toLocaleDateString("vi-VN") : "Hôm nay")}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="md-card" style={{ marginTop: "20px" }}>
            <h3 className="card-title">
              <span className="material-symbols-outlined">description</span>
              Danh sách Giáo án Phụ lục 10 của bạn ({currentUser.email})
            </h3>
            <div className="table-responsive">
              <table className="md-table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Tên bài học</th>
                    <th>Môn học - Mã môn</th>
                    <th>Thời lượng</th>
                    <th>Ngày dạy</th>
                  </tr>
                </thead>
                <tbody>
                  {lessonPlansList.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="empty-cell">Chưa có giáo án Phụ lục 10 nào được lưu cho tài khoản này.</td>
                    </tr>
                  ) : (
                    lessonPlansList.map((item, idx) => (
                      <tr key={item.id || idx}>
                        <td>{idx + 1}</td>
                        <td><b>{item.lessonTitle || "—"}</b></td>
                        <td>{item.courseName || "—"} ({item.courseCode || "—"})</td>
                        <td>{item.periods || 0} tiết ({item.minutes || 0} phút)</td>
                        <td>{item.date || "—"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* MATERIAL 3 & USER PROFILE STYLES */}
      <style jsx>{`
        .md-shell {
          max-width: 1560px;
          margin: 0 auto;
          padding: 20px 16px 40px;
        }

        .md-hero {
          background: linear-gradient(135deg, #16469d 0%, #1e3a8a 100%);
          color: #ffffff;
          border-radius: var(--md-radius-lg);
          padding: 26px 30px 22px;
          margin-bottom: 20px;
          box-shadow: var(--md-shadow-3);
          position: relative;
          overflow: visible;
        }

        .md-hero-top-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          flex-wrap: wrap;
          gap: 12px;
        }

        .md-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.25);
          padding: 4px 12px;
          border-radius: var(--md-radius-full);
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.2px;
        }

        /* USER PROFILE CORNER PILL */
        .md-user-profile-box {
          position: relative;
          z-index: 100;
        }

        .user-pill {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(0, 0, 0, 0.35);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 4px 12px 4px 5px;
          border-radius: var(--md-radius-full);
          cursor: pointer;
          transition: all 0.2s;
        }

        .user-pill:hover {
          background: rgba(0, 0, 0, 0.5);
          border-color: rgba(255, 255, 255, 0.4);
        }

        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #1d9bf0;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 14px;
          overflow: hidden;
        }

        .user-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .user-info-text {
          display: flex;
          flex-direction: column;
          line-height: 1.2;
        }

        .user-name {
          font-size: 13px;
          font-weight: 700;
          color: #ffffff;
        }

        .user-email {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.7);
        }

        .dropdown-arrow {
          font-size: 18px;
          opacity: 0.8;
        }

        .user-dropdown-menu {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 250px;
          background: #000000;
          border: 1px solid #2f3336;
          border-radius: 14px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          padding: 8px 0;
          animation: dropPop 0.2s ease-out;
        }

        @keyframes dropPop {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .dropdown-header {
          padding: 10px 16px;
        }

        .dropdown-header b {
          font-size: 14px;
          color: #ffffff;
        }

        .small-email {
          font-size: 12px;
          color: #71767b;
          word-break: break-all;
        }

        .user-badge-tag {
          margin-top: 6px;
          font-size: 11px;
          color: #1d9bf0;
          font-weight: 600;
        }

        .dropdown-divider {
          height: 1px;
          background: #2f3336;
          margin: 6px 0;
        }

        .dropdown-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 16px;
          background: transparent;
          border: 0;
          color: #e7e9ea;
          font-size: 13.5px;
          font-weight: 600;
          text-align: left;
          cursor: pointer;
          transition: background 0.15s;
        }

        .dropdown-item:hover {
          background: rgba(239, 243, 244, 0.1);
        }

        .dropdown-item.logout {
          color: #f4212e;
        }

        .dropdown-item.logout:hover {
          background: rgba(244, 33, 46, 0.1);
        }

        .md-hero-title {
          font-size: 28px;
          font-weight: 800;
          letter-spacing: -0.5px;
          margin-bottom: 8px;
        }

        .md-hero-sub {
          font-size: 14.5px;
          opacity: 0.92;
          max-width: 950px;
          margin-bottom: 22px;
          font-weight: 400;
        }

        .md-tabs {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .md-tab {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.28);
          color: #ffffff;
          padding: 9px 18px;
          border-radius: var(--md-radius-full);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          font-family: inherit;
        }

        .md-tab:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: translateY(-1px);
        }

        .md-tab.active {
          background: #ffffff;
          color: var(--md-primary-hover);
          border-color: #ffffff;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
        }

        .md-server-status {
          position: absolute;
          bottom: 22px;
          right: 28px;
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(0, 0, 0, 0.25);
          padding: 6px 14px;
          border-radius: var(--md-radius-full);
          font-size: 12.5px;
          font-weight: 600;
        }

        .status-dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
        }

        .status-dot.online { background: #10b981; box-shadow: 0 0 8px #10b981; }
        .status-dot.connecting { background: #f59e0b; }
        .status-dot.offline, .status-dot.error { background: #ef4444; }

        .md-transfer-banner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          background: var(--md-success-container);
          border: 1px solid var(--md-success-border);
          border-radius: var(--md-radius-md);
          padding: 14px 20px;
          margin-bottom: 20px;
          box-shadow: var(--md-shadow-1);
          animation: slideDown 0.3s ease-out;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .transfer-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .check-icon {
          color: var(--md-success);
          font-size: 28px;
        }

        .transfer-title {
          font-weight: 700;
          color: #065f46;
          font-size: 14.5px;
        }

        .transfer-desc {
          font-size: 13.5px;
          color: #047857;
          margin-top: 2px;
        }

        .md-btn-sm {
          background: var(--md-success);
          color: #ffffff;
          border: 0;
          border-radius: var(--md-radius-sm);
          padding: 8px 16px;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .md-btn-sm:hover {
          background: #047857;
        }

        .md-section {
          background: var(--md-surface);
          border-radius: var(--md-radius-lg);
          margin-bottom: 24px;
          box-shadow: var(--md-shadow-2);
          overflow: hidden;
          border: 1px solid var(--md-outline);
        }

        .md-section-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          padding: 16px 22px;
          background: var(--md-surface-variant);
          border-bottom: 1px solid var(--md-outline);
        }

        .head-info {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .step-badge {
          background: var(--md-primary-container);
          color: var(--md-on-primary-container);
          font-weight: 800;
          font-size: 12px;
          padding: 6px 12px;
          border-radius: var(--md-radius-sm);
          letter-spacing: 0.5px;
        }

        .md-section-head h2 {
          font-size: 18px;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }

        .md-section-head p {
          font-size: 13px;
          color: #64748b;
          margin: 2px 0 0;
        }

        .md-btn-outline {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          color: #334155;
          padding: 8px 14px;
          border-radius: var(--md-radius-sm);
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .md-btn-outline:hover {
          background: #f1f5f9;
          border-color: #94a3b8;
        }

        .md-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--md-primary);
          color: #ffffff;
          padding: 9px 18px;
          border-radius: var(--md-radius-sm);
          font-weight: 700;
          font-size: 13.5px;
          text-decoration: none;
          transition: all 0.2s;
        }

        .md-btn-primary:hover {
          background: var(--md-primary-hover);
        }

        .md-workflow-note {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 14px 20px;
          padding: 12px 16px;
          border-radius: var(--md-radius-md);
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          color: #1e40af;
          font-size: 13.5px;
        }

        iframe {
          width: 100%;
          border: 0;
          display: block;
          background: #ffffff;
          transition: height 0.2s ease-in-out;
        }

        .md-dash-body {
          padding: 24px 20px;
        }

        .md-kpi-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .md-kpi-card {
          display: flex;
          align-items: center;
          gap: 16px;
          background: #ffffff;
          border: 1px solid var(--md-outline);
          border-radius: var(--md-radius-md);
          padding: 18px;
          box-shadow: var(--md-shadow-1);
        }

        .kpi-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .kpi-icon .material-symbols-outlined { font-size: 26px; }
        .kpi-icon.blue { background: #dbeafe; color: #1e40af; }
        .kpi-icon.green { background: #d1fae5; color: #065f46; }
        .kpi-icon.purple { background: #ede9fe; color: #5b21b6; }
        .kpi-icon.orange { background: #ffedd5; color: #9a3412; }

        .kpi-value {
          font-size: 24px;
          font-weight: 800;
          color: #0f172a;
        }

        .kpi-label {
          font-size: 13px;
          color: #64748b;
          font-weight: 500;
        }

        .md-card {
          background: #ffffff;
          border: 1px solid var(--md-outline);
          border-radius: var(--md-radius-md);
          padding: 20px;
          box-shadow: var(--md-shadow-1);
        }

        .card-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 16px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 16px;
        }

        .table-responsive {
          overflow-x: auto;
        }

        .md-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13.5px;
        }

        .md-table th {
          background: #f8fafc;
          padding: 10px 14px;
          text-align: left;
          font-weight: 700;
          color: #475569;
          border-bottom: 1px solid var(--md-outline);
        }

        .md-table td {
          padding: 12px 14px;
          border-bottom: 1px solid #f1f5f9;
          color: #334155;
        }

        .empty-cell {
          text-align: center;
          padding: 30px !important;
          color: #94a3b8;
        }

        @media (max-width: 900px) {
          .md-hero-title { font-size: 22px; }
          .md-server-status { position: static; margin-top: 14px; display: inline-flex; }
        }
      `}</style>
    </main>
  );
}