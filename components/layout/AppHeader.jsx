"use client";

import { useState } from "react";
import { 
  Sparkles, 
  Search, 
  HelpCircle, 
  LogOut, 
  User, 
  ChevronDown, 
  Database,
  LayoutDashboard,
  BookOpen,
  Calendar,
  FileEdit,
  FolderKanban,
  Bot,
  Settings
} from "lucide-react";

export default function AppHeader({ 
  currentUser, 
  activeTab, 
  onTabChange, 
  onSignOut,
  serverStatus = "online"
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navItems = [
    { id: "overview", label: "Tổng quan", icon: LayoutDashboard },
    { id: "step1", label: "Sổ đầu bài", icon: Calendar },
    { id: "step2", label: "Soạn giáo án", icon: FileEdit },
    { id: "sessions", label: "Phiên làm việc", icon: FolderKanban },
    { id: "ai", label: "Trợ lý AI", icon: Bot },
    { id: "dashboard", label: "CSDL & Thống kê", icon: Database },
  ];

  return (
    <header className="enterprise-nav">
      <div className="nav-container">
        {/* LEFT: BRAND */}
        <div className="nav-brand" onClick={() => onTabChange("overview")}>
          <div className="brand-logo-badge">
            <span className="logo-letters">NSG</span>
            <div className="logo-glow"></div>
          </div>
          <div className="brand-text">
            <div className="brand-title">
              QUẢN LÝ GIẢNG DẠY AI
              <span className="badge-pro">ENTERPRISE</span>
            </div>
            <div className="brand-sub">Sổ đầu bài & Soạn giáo án Phụ lục 10 · BKNSG</div>
          </div>
        </div>

        {/* CENTER: NAV ITEMS */}
        <nav className="nav-links">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id || (activeTab === "all" && item.id === "step1");
            return (
              <button
                key={item.id}
                className={`nav-link-btn ${isActive ? "active" : ""}`}
                onClick={() => onTabChange(item.id)}
              >
                <Icon size={16} />
                <span>{item.label}</span>
                {isActive && <div className="active-indicator"></div>}
              </button>
            );
          })}
        </nav>

        {/* RIGHT: CONTROLS & USER PROFILE */}
        <div className="nav-right">
          {/* AI STATUS PILL */}
          <div className="ai-status-pill">
            <Sparkles size={14} className="sparkle-icon" />
            <span className="ai-status-text">Gemini 3.7 AI Sẵn sàng</span>
            <span className="status-indicator-dot online"></span>
          </div>

          {/* USER PROFILE DROPDOWN */}
          {currentUser && (
            <div className="user-menu-wrapper">
              <div 
                className="user-badge-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <div className="user-avatar-circle">
                  {currentUser.photoURL ? (
                    <img src={currentUser.photoURL} alt="Avatar" />
                  ) : (
                    <span>{(currentUser.displayName || currentUser.email || 'G')[0].toUpperCase()}</span>
                  )}
                </div>
                <div className="user-details">
                  <span className="user-name-text">{currentUser.displayName || 'Giảng viên'}</span>
                  <span className="user-role-text">{currentUser.email || 'BKNSG'}</span>
                </div>
                <ChevronDown size={14} className="chevron-icon" />
              </div>

              {dropdownOpen && (
                <div className="dropdown-panel">
                  <div className="dropdown-user-header">
                    <b>{currentUser.displayName || 'Giảng viên'}</b>
                    <p>{currentUser.email}</p>
                    <span className="cloud-sync-tag">☁️ Đồng bộ Cloud Firestore</span>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button 
                    className="dropdown-action-btn"
                    onClick={() => { onTabChange("dashboard"); setDropdownOpen(false); }}
                  >
                    <Database size={15} />
                    <span>Quản lý CSDL cá nhân</span>
                  </button>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-action-btn logout-btn" onClick={onSignOut}>
                    <LogOut size={15} />
                    <span>Đăng xuất tài khoản</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .enterprise-nav {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: #0f172a;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(16px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
        }

        .nav-container {
          max-width: 1600px;
          margin: 0 auto;
          padding: 0 20px;
          height: 68px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .nav-brand {
          display: flex;
          align-items: center;
          gap: 14px;
          cursor: pointer;
        }

        .brand-logo-badge {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: linear-gradient(135deg, #1a56db 0%, #0284c7 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-weight: 900;
          font-size: 15px;
          letter-spacing: -0.5px;
          position: relative;
          box-shadow: 0 4px 14px rgba(26, 86, 219, 0.4);
        }

        .logo-glow {
          position: absolute;
          inset: -2px;
          border-radius: 14px;
          background: radial-gradient(circle, rgba(2, 132, 199, 0.4) 0%, transparent 70%);
          z-index: -1;
        }

        .brand-title {
          font-size: 15px;
          font-weight: 800;
          color: #ffffff;
          display: flex;
          align-items: center;
          gap: 8px;
          letter-spacing: -0.2px;
        }

        .badge-pro {
          background: rgba(2, 132, 199, 0.2);
          border: 1px solid rgba(2, 132, 199, 0.5);
          color: #38bdf8;
          font-size: 10px;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 4px;
          letter-spacing: 0.5px;
        }

        .brand-sub {
          font-size: 11.5px;
          color: #94a3b8;
          margin-top: 1px;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .nav-link-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          border: 0;
          color: #94a3b8;
          padding: 8px 14px;
          border-radius: 8px;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
        }

        .nav-link-btn:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.06);
        }

        .nav-link-btn.active {
          color: #ffffff;
          background: rgba(26, 86, 219, 0.15);
        }

        .active-indicator {
          position: absolute;
          bottom: -15px;
          left: 14px;
          right: 14px;
          height: 3px;
          background: #38bdf8;
          border-radius: 3px 3px 0 0;
          box-shadow: 0 0 10px #38bdf8;
        }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .ai-status-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(56, 189, 248, 0.3);
          padding: 6px 14px;
          border-radius: 9999px;
          color: #e2e8f0;
          font-size: 12.5px;
          font-weight: 600;
        }

        .sparkle-icon {
          color: #38bdf8;
          animation: pulseGlow 2s infinite;
        }

        @keyframes pulseGlow {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.15); opacity: 0.8; }
        }

        .status-indicator-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 8px #10b981;
        }

        .user-menu-wrapper {
          position: relative;
        }

        .user-badge-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          padding: 4px 12px 4px 5px;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .user-badge-btn:hover {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(255, 255, 255, 0.25);
        }

        .user-avatar-circle {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: #1a56db;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 13px;
          overflow: hidden;
        }

        .user-avatar-circle img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .user-details {
          display: flex;
          flex-direction: column;
          line-height: 1.15;
          text-align: left;
        }

        .user-name-text {
          font-size: 12.5px;
          font-weight: 700;
          color: #ffffff;
        }

        .user-role-text {
          font-size: 11px;
          color: #94a3b8;
        }

        .chevron-icon {
          color: #64748b;
        }

        .dropdown-panel {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          width: 250px;
          background: #0f172a;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 14px;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6);
          padding: 8px 0;
          z-index: 100;
          animation: popMenu 0.15s ease-out;
        }

        @keyframes popMenu {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .dropdown-user-header {
          padding: 12px 16px;
        }

        .dropdown-user-header b {
          font-size: 14px;
          color: #ffffff;
        }

        .dropdown-user-header p {
          font-size: 12px;
          color: #94a3b8;
          word-break: break-all;
          margin-top: 2px;
        }

        .cloud-sync-tag {
          display: inline-block;
          font-size: 11px;
          color: #38bdf8;
          font-weight: 600;
          margin-top: 6px;
        }

        .dropdown-divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.08);
          margin: 6px 0;
        }

        .dropdown-action-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 16px;
          background: transparent;
          border: 0;
          color: #e2e8f0;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s;
        }

        .dropdown-action-btn:hover {
          background: rgba(255, 255, 255, 0.08);
        }

        .dropdown-action-btn.logout-btn {
          color: #f87171;
        }

        .dropdown-action-btn.logout-btn:hover {
          background: rgba(239, 68, 68, 0.12);
        }

        @media (max-width: 1100px) {
          .nav-links { display: none; }
          .ai-status-pill { display: none; }
        }
      `}</style>
    </header>
  );
}