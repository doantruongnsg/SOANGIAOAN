"use client";

import { useEffect, useRef, useState } from "react";
import AuthScreen from "./AuthScreen";
import AppHeader from "./layout/AppHeader";
import HeroSection from "./dashboard/HeroSection";
import QuickStatsGrid from "./dashboard/QuickStatsGrid";
import WorkflowStepper from "./dashboard/WorkflowStepper";
import CourseTypeSelector from "./course/CourseTypeSelector";
import ProgramUploadCard from "./course/ProgramUploadCard";
import ScheduleBuilder from "./schedule/ScheduleBuilder";
import SessionManagerCard from "./sessions/SessionManagerCard";
import LessonPlanWorkspace from "./lesson-plan/LessonPlanWorkspace";
import AIAssistantCard from "./ai/AIAssistantCard";
import { AuthService } from "../lib/auth";
import { UserSyncService } from "../lib/user-sync";

export default function MainAppShell() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const plannerRef = useRef(null);
  const scheduleRef = useRef(null);
  const step2Ref = useRef(null);
  
  const [activeTab, setActiveTab] = useState("overview"); // 'overview' | 'step1' | 'step2' | 'sessions' | 'ai' | 'dashboard' | 'all'
  const [transfer, setTransfer] = useState(null);
  const [scheduleHeight, setScheduleHeight] = useState(2400);
  const [plannerHeight, setPlannerHeight] = useState(2800);
  
  // App state
  const [currentCourse, setCurrentCourse] = useState({
    name: "",
    code: "",
    mode: "integrated",
    modeLabel: "Môn Tích hợp",
    total: 0,
    converted: 0
  });
  const [stats, setStats] = useState({ totalPrograms: 2, totalSchedules: 0, totalSessions: 0, totalLessonPlans: 0 });
  const [schedulesList, setSchedulesList] = useState([]);
  const [lessonPlansList, setLessonPlansList] = useState([]);
  const [serverStatus, setServerStatus] = useState("connecting");
  const [currentStep, setCurrentStep] = useState(1);

  // Auth State Listener
  useEffect(() => {
    const unsubscribe = AuthService.onAuthChange((user) => {
      setCurrentUser(user);
      setAuthLoading(false);
      if (user) {
        loadUserCloudData(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  // Check server health & listen for iframe messages
  useEffect(() => {
    fetch("/api/health")
      .then(res => res.json())
      .then(data => {
        if (data.status === "ok" || data.ok) setServerStatus("online");
        else setServerStatus("error");
      })
      .catch(() => setServerStatus("offline"));

    const handler = (e) => {
      if (e.data?.type === "OPEN_LESSON_PLAN_FROM_SCHEDULE") {
        const p = e.data.payload || {};
        setTransfer(p);
        setCurrentStep(5);
        
        plannerRef.current?.contentWindow?.postMessage(
          { type: "LOAD_SCHEDULE_SESSION", payload: p },
          "*"
        );
        
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
  }, [currentUser]);

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

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (tabId === "dashboard" && currentUser?.uid) {
      loadUserCloudData(currentUser.uid);
    }
  };

  const handleSignOut = async () => {
    await AuthService.signOut();
    setCurrentUser(null);
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
        <div style={{ fontSize: 15, fontWeight: 700, color: '#1e3a8a' }}>Đang khởi tạo nền tảng Quản lý Giảng dạy AI...</div>
      </div>
    );
  }

  // If not logged in -> Show Luminous NSG Auth Screen
  if (!currentUser) {
    return <AuthScreen onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  return (
    <div className="platform-root">
      {/* 1. ENTERPRISE STICKY APP HEADER */}
      <AppHeader
        currentUser={currentUser}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onSignOut={handleSignOut}
        serverStatus={serverStatus}
      />

      {/* PLATFORM MAIN CONTAINER */}
      <main className="platform-container">
        {/* 2. HERO SECTION */}
        {(activeTab === "overview" || activeTab === "all") && (
          <HeroSection
            onStartSchedule={() => { handleTabChange("step1"); setCurrentStep(4); }}
            onOpenRecentSession={() => handleTabChange("sessions")}
          />
        )}

        {/* 3. QUICK STATS GRID */}
        <QuickStatsGrid
          currentCourse={currentCourse}
          progressText="32 / 75 tiết"
          totalSessionsCount={schedulesList[0]?.sessions?.length || 7}
          totalLessonPlansCount={lessonPlansList.length || 6}
          totalWorkSessionsCount={schedulesList.length || 3}
        />

        {/* 4. WORKFLOW STEPPER */}
        <WorkflowStepper
          currentStep={currentStep}
          onStepClick={(stepId) => {
            if (stepId === "step1" || stepId === "course-type" || stepId === "upload-program" || stepId === "schedule-config") {
              handleTabChange("step1");
            } else if (stepId === "step2") {
              handleTabChange("step2");
            } else if (stepId === "ai") {
              handleTabChange("ai");
            }
          }}
        />

        {/* TRANSFER ALERT BANNER */}
        {transfer && (
          <div className="transfer-alert-card">
            <div className="transfer-content">
              <span className="transfer-icon">✓</span>
              <div>
                <b>Đã tiếp nhận buổi học từ Sổ đầu bài thành công!</b>
                <p>
                  Môn: <b>{transfer.courseName || ""}</b> ({transfer.courseCode || ""}) · <b>{transfer.weekday || ""}</b> {transfer.date || ""} · <b>{transfer.periods || 0} tiết</b> ({(transfer.periods || 0) * 45} phút) · Giáo án số <b>{transfer.scheduleTT || "01"}</b>
                </p>
              </div>
            </div>
            <button className="btn-goto-plan" onClick={() => handleTabChange("step2")}>
              Đến trình soạn thảo Phụ lục 10 →
            </button>
          </div>
        )}

        {/* SECTION 1: LẬP SỔ ĐẦU BÀI */}
        <section 
          id="step1"
          style={{ display: activeTab === "step1" || activeTab === "overview" || activeTab === "all" ? "block" : "none" }}
        >
          {/* COURSE TYPE SELECTION */}
          <CourseTypeSelector
            selectedMode={currentCourse.mode}
            onSelectMode={(mode) => {
              const label = mode === "theory" ? "Môn Lý thuyết" : mode === "practice" ? "Môn Thực hành" : "Môn Tích hợp";
              setCurrentCourse(prev => ({ ...prev, mode, modeLabel: label }));
              setCurrentStep(2);
            }}
          />

          {/* SỔ ĐẦU BÀI FRAME WITH ENTERPRISE TABLE */}
          <div className="enterprise-frame-card">
            <div className="frame-card-header">
              <div className="header-badge">BƯỚC 4</div>
              <div>
                <h3>LẬP SỔ ĐẦU BÀI TỪ CHƯƠNG TRÌNH MÔN HỌC</h3>
                <p>Sau khi chia lịch, tại từng dòng Sổ đầu bài bấm “SOẠN GIÁO ÁN BUỔI NÀY” để tự động chuyển tiếp.</p>
              </div>
            </div>

            <iframe
              ref={scheduleRef}
              id="scheduleFrame"
              title="Lập Sổ đầu bài"
              src="/frames/schedule.html"
              style={{ height: `${scheduleHeight}px` }}
            />
          </div>
        </section>

        {/* SECTION 2: SOẠN GIÁO ÁN PHỤ LỤC 10 */}
        <section
          id="step2"
          ref={step2Ref}
          style={{ display: activeTab === "step2" || activeTab === "all" ? "block" : "none" }}
        >
          <div className="enterprise-frame-card" style={{ marginBottom: 20 }}>
            <div className="frame-card-header">
              <div className="header-badge">BƯỚC 5</div>
              <div>
                <h3>SOẠN GIÁO ÁN THEO TỪNG BUỔI (MẪU PHỤ LỤC 10)</h3>
                <p>Khóa chính xác môn học, mã môn, ngày dạy, số tiết, bài học trước từ SĐB và trợ lý AI Gemini.</p>
              </div>
            </div>
          </div>

          <LessonPlanWorkspace
            transferData={transfer || {}}
            plannerFrameRef={plannerRef}
            plannerHeight={plannerHeight}
            onCheckTime={() => {
              plannerRef.current?.contentWindow?.document?.getElementById("btnCheck")?.click();
            }}
            onRunAI={() => {
              plannerRef.current?.contentWindow?.document?.getElementById("btnAIWhole")?.click();
            }}
            onExportWord={() => {
              plannerRef.current?.contentWindow?.document?.getElementById("btnExportDoc")?.click();
            }}
            onExportPdf={() => {
              plannerRef.current?.contentWindow?.document?.getElementById("btnExportPdf")?.click();
            }}
            onPrint={() => {
              plannerRef.current?.contentWindow?.print();
            }}
          />
        </section>

        {/* SECTION 3: PHIÊN LÀM VIỆC */}
        <section
          id="sessions"
          style={{ display: activeTab === "sessions" || activeTab === "all" ? "block" : "none" }}
        >
          <SessionManagerCard
            sessions={schedulesList}
            onSaveSession={() => {
              scheduleRef.current?.contentWindow?.document?.getElementById("btnSaveSession")?.click();
            }}
            onLoadSession={(id) => {
              scheduleRef.current?.contentWindow?.postMessage({ type: "LOAD_SAVED_SESSION", id }, "*");
              handleTabChange("step1");
            }}
            onDeleteSession={(id) => {
              if (currentUser?.uid) {
                UserSyncService.deleteSchedule(currentUser.uid, id)
                  .then(() => loadUserCloudData(currentUser.uid))
                  .catch(e => console.error(e));
              }
            }}
          />
        </section>

        {/* SECTION 4: TRỢ LÝ AI GEMINI */}
        <section
          id="ai"
          style={{ display: activeTab === "ai" || activeTab === "all" ? "block" : "none" }}
        >
          <AIAssistantCard
            onTestConnection={() => {
              plannerRef.current?.contentWindow?.document?.getElementById("btnTestAI")?.click();
            }}
            onRunWholeAI={() => {
              handleTabChange("step2");
              setTimeout(() => {
                plannerRef.current?.contentWindow?.document?.getElementById("btnAIWhole")?.click();
              }, 300);
            }}
          />
        </section>

        {/* SECTION 5: CSDL & THỐNG KÊ DASHBOARD */}
        <section
          id="dashboard"
          style={{ display: activeTab === "dashboard" ? "block" : "none" }}
        >
          <div className="enterprise-frame-card">
            <div className="frame-card-header">
              <div className="header-badge">CSDL & CLOUD</div>
              <div>
                <h3>TRUNG TÂM QUẢN LÝ DỮ LIỆU CÁ NHÂN & CƠ SỞ DỮ LIỆU</h3>
                <p>Toàn bộ Sổ đầu bài và Giáo án Phụ lục 10 của giảng viên <b>{currentUser.email}</b></p>
              </div>
              <div style={{ marginLeft: "auto" }}>
                <a href="/api/backup" className="btn-download-backup" download>
                  ↓ Tải sao lưu CSDL (.JSON)
                </a>
              </div>
            </div>

            <div className="dash-tables-wrapper">
              <h4 className="table-heading">📋 Danh sách Sổ đầu bài đã lưu</h4>
              <div className="table-responsive">
                <table className="enterprise-table">
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
                        <td colSpan="5" className="empty-row">Chưa có phiên Sổ đầu bài nào được lưu cho tài khoản này.</td>
                      </tr>
                    ) : (
                      schedulesList.map((item, idx) => (
                        <tr key={item.id || idx}>
                          <td>{idx + 1}</td>
                          <td><b>{item.name || "Phiên làm việc"}</b></td>
                          <td>{item.course?.name || "—"} ({item.course?.code || "—"})</td>
                          <td>{Array.isArray(item.sessions) ? item.sessions.length : 0} buổi</td>
                          <td>{item.updatedAt?.toDate ? item.updatedAt.toDate().toLocaleDateString("vi-VN") : "Hôm nay"}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </main>

      <style jsx>{`
        .platform-root {
          min-height: 100vh;
          background: #f8fafc;
          color: #0f172a;
          font-family: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .platform-container {
          max-width: 1560px;
          margin: 0 auto;
          padding: 24px 20px 60px;
        }

        .transfer-alert-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #ecfdf5;
          border: 1px solid #86efac;
          border-radius: 16px;
          padding: 16px 22px;
          margin-bottom: 24px;
          box-shadow: 0 2px 8px rgba(5, 150, 105, 0.08);
          gap: 16px;
          flex-wrap: wrap;
        }

        .transfer-content {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .transfer-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #059669;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 16px;
        }

        .transfer-content b {
          font-size: 14.5px;
          color: #065f46;
        }

        .transfer-content p {
          font-size: 13.5px;
          color: #047857;
          margin: 2px 0 0;
        }

        .btn-goto-plan {
          background: #059669;
          color: #ffffff;
          border: 0;
          border-radius: 10px;
          padding: 9px 18px;
          font-size: 13.5px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-goto-plan:hover {
          background: #047857;
          transform: translateY(-1px);
        }

        .enterprise-frame-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
          margin-bottom: 24px;
        }

        .frame-card-header {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 18px 24px;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }

        .header-badge {
          background: #e0edff;
          color: #1a56db;
          font-weight: 800;
          font-size: 11.5px;
          padding: 5px 12px;
          border-radius: 6px;
          letter-spacing: 0.5px;
        }

        .frame-card-header h3 {
          font-size: 17.5px;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }

        .frame-card-header p {
          font-size: 13px;
          color: #64748b;
          margin: 2px 0 0;
        }

        .btn-download-backup {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #1a56db;
          color: #ffffff;
          text-decoration: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
        }

        .btn-download-backup:hover {
          background: #0f3ba1;
        }

        iframe {
          width: 100%;
          border: 0;
          display: block;
          background: #ffffff;
          transition: height 0.2s ease-in-out;
        }

        .dash-tables-wrapper {
          padding: 24px;
        }

        .table-heading {
          font-size: 16px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 14px;
        }

        .table-responsive {
          overflow-x: auto;
        }

        .enterprise-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13.5px;
        }

        .enterprise-table th {
          background: #f1f5f9;
          padding: 11px 16px;
          text-align: left;
          font-weight: 700;
          color: #475569;
          border-bottom: 1px solid #cbd5e1;
        }

        .enterprise-table td {
          padding: 13px 16px;
          border-bottom: 1px solid #f1f5f9;
          color: #334155;
        }

        .empty-row {
          text-align: center;
          padding: 36px !important;
          color: #94a3b8;
          font-style: italic;
        }
      `}</style>
    </div>
  );
}