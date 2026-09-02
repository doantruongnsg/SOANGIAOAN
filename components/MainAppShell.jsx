"use client";

import { useEffect, useRef, useState } from "react";

export default function MainAppShell() {
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

  useEffect(() => {
    // Check server health
    fetch("/api/health")
      .then(res => res.json())
      .then(data => {
        if (data.status === "ok") setServerStatus("online");
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
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsRes, schedRes, lpRes] = await Promise.all([
        fetch("/api/stats").then(r => r.json()),
        fetch("/api/schedules").then(r => r.json()),
        fetch("/api/lesson-plans").then(r => r.json())
      ]);
      if (statsRes.success) setStats(statsRes.data);
      if (schedRes.success) setSchedulesList(schedRes.data || []);
      if (lpRes.success) setLessonPlansList(lpRes.data || []);
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

  return (
    <main className="md-shell">
      {/* MATERIAL 3 TOP APP BAR & HERO */}
      <header className="md-hero">
        <div className="md-hero-content">
          <div className="md-hero-badge">
            <span className="material-symbols-outlined">school</span>
            <span>Trường Cao đẳng Bách khoa Nam Sài Gòn · Khoa CNTT - KTĐ</span>
          </div>
          <h1 className="md-hero-title">
            QUẢN LÝ SỔ ĐẦU BÀI & SOẠN GIÁO ÁN
          </h1>
          <p className="md-hero-sub">
            Hệ thống phân bổ lịch dạy tự động & Soạn giáo án <b>Mẫu Phụ lục 10</b> đạt chuẩn quy định · Tác giả: <b>Trần Hữu Nhân</b>
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
              <h2>TRUNG TÂM QUẢN LÝ DỮ LIỆU & CƠ SỞ DỮ LIỆU</h2>
              <p>Xem toàn bộ Sổ đầu bài, Giáo án Phụ lục 10, cấu hình giảng viên và sao lưu CSDL.</p>
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
                <div className="kpi-value">{stats.totalSchedules || schedulesList.length || 0}</div>
                <div className="kpi-label">Phiên Sổ đầu bài đã lưu</div>
              </div>
            </div>
            <div className="md-kpi-card">
              <div className="kpi-icon purple"><span className="material-symbols-outlined">assignment</span></div>
              <div className="kpi-data">
                <div className="kpi-value">{stats.totalLessonPlans || lessonPlansList.length || 0}</div>
                <div className="kpi-label">Giáo án Phụ lục 10</div>
              </div>
            </div>
            <div className="md-kpi-card">
              <div className="kpi-icon orange"><span className="material-symbols-outlined">cloud_sync</span></div>
              <div className="kpi-data">
                <div className="kpi-value">Sẵn sàng</div>
                <div className="kpi-label">Đồng bộ Cloud & JSON</div>
              </div>
            </div>
          </div>

          {/* TABLES */}
          <div className="md-card">
            <h3 className="card-title">
              <span className="material-symbols-outlined">table_chart</span>
              Danh sách Sổ đầu bài đã lưu
            </h3>
            <div className="table-responsive">
              <table className="md-table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Tên phiên làm việc</th>
                    <th>Môn học - Mã môn</th>
                    <th>Số buổi</th>
                    <th>Ngày tạo</th>
                  </tr>
                </thead>
                <tbody>
                  {schedulesList.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="empty-cell">Chưa có phiên Sổ đầu bài nào được lưu trên máy chủ.</td>
                    </tr>
                  ) : (
                    schedulesList.map((item, idx) => (
                      <tr key={item.id || idx}>
                        <td>{idx + 1}</td>
                        <td><b>{item.name || "Phiên làm việc"}</b></td>
                        <td>{item.course?.name || "—"} ({item.course?.code || "—"})</td>
                        <td>{Array.isArray(item.sessions) ? item.sessions.length : 0} buổi</td>
                        <td>{item.createdAt ? new Date(item.createdAt).toLocaleDateString("vi-VN") : "—"}</td>
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
              Danh sách Giáo án Phụ lục 10 đã lưu
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
                      <td colSpan="5" className="empty-cell">Chưa có giáo án Phụ lục 10 nào được lưu trên máy chủ.</td>
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

      {/* MATERIAL 3 STYLES */}
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
          overflow: hidden;
        }

        .md-hero::after {
          content: "";
          position: absolute;
          top: -50%;
          right: -10%;
          width: 350px;
          height: 350px;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 70%);
          border-radius: 50%;
          pointer-events: none;
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
          margin-bottom: 12px;
          letter-spacing: 0.2px;
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
          top: 24px;
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