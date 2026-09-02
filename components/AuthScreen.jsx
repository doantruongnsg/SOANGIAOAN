"use client";

import { useState } from "react";
import { AuthService } from "../lib/auth";

export default function AuthScreen({ onLoginSuccess }) {
  const [modalMode, setModalMode] = useState(null); // 'signin' | 'signup' | null
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError("");
      const user = await AuthService.signInWithGoogle();
      if (user && onLoginSuccess) onLoginSuccess(user);
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') {
        setError("Bạn đã đóng cửa sổ đăng nhập Google.");
      } else {
        setError(err.message || "Lỗi đăng nhập Google.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ Email và Mật khẩu.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const user = await AuthService.signInWithEmail(email, password);
      if (user && onLoginSuccess) onLoginSuccess(user);
    } catch (err) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError("Email hoặc mật khẩu không chính xác.");
      } else {
        setError(err.message || "Lỗi đăng nhập.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ Email và Mật khẩu.");
      return;
    }
    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const user = await AuthService.signUpWithEmail(email, password, displayName);
      if (user && onLoginSuccess) onLoginSuccess(user);
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError("Email này đã được đăng ký tài khoản.");
      } else {
        setError(err.message || "Lỗi tạo tài khoản.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGuestSignIn = () => {
    const guestUser = AuthService.signInAsGuest();
    if (onLoginSuccess) onLoginSuccess(guestUser);
  };

  return (
    <div className="nsg-auth-wrapper">
      <div className="nsg-auth-container">
        {/* LEFT COLUMN: LUMINOUS NSG EMBLEM */}
        <div className="nsg-left-hero">
          <div className="nsg-brand-card">
            <div className="nsg-logo-emblem">
              <div className="nsg-emblem-inner">
                <span className="nsg-letters">NSG</span>
                <span className="nsg-sub-text">BÁCH KHOA</span>
              </div>
              <div className="nsg-glow-ring"></div>
            </div>

            <div className="nsg-school-info">
              <div className="nsg-school-badge">
                <span className="material-symbols-outlined">verified</span>
                <span>HỆ THỐNG ĐÀO TẠO CHUẨN BỘ LĐ-TB&XH</span>
              </div>
              <h2 className="nsg-school-name">TRƯỜNG CAO ĐẲNG BÁCH KHOA NAM SÀI GÒN</h2>
              <p className="nsg-department">Khoa Công nghệ Thông tin - Kinh tế số</p>
              <div className="nsg-app-tag">
                <b>Quản lý Sổ đầu bài & Soạn giáo án Phụ lục 10</b>
                <span>Thiết kế bởi Giảng viên Trần Hữu Nhân</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: LUMINOUS AUTH CARD */}
        <div className="nsg-right-content">
          <div className="nsg-auth-card">
            <div className="nsg-mobile-header">
              <div className="nsg-mini-logo">NSG</div>
              <div>
                <b>Bách khoa Nam Sài Gòn</b>
                <p>Cổng Quản lý Giáo án & SĐB</p>
              </div>
            </div>

            <h1 className="nsg-main-title">Đang diễn ra ngay bây giờ</h1>
            <p className="nsg-sub-title">Đăng nhập để đồng bộ lịch dạy và giáo án cá nhân trên Cloud.</p>

            {error && (
              <div className="nsg-error-banner">
                <span className="material-symbols-outlined">error</span>
                <span>{error}</span>
              </div>
            )}

            <div className="nsg-actions-box">
              {/* GOOGLE SIGN IN */}
              <button 
                type="button" 
                className="nsg-pill-btn nsg-btn-google"
                onClick={handleGoogleSignIn}
                disabled={loading}
              >
                <svg className="google-icon" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Đăng nhập với Google</span>
              </button>

              {/* DIVIDER */}
              <div className="nsg-divider">
                <span className="nsg-divider-line"></span>
                <span className="nsg-divider-text">hoặc tài khoản giảng viên</span>
                <span className="nsg-divider-line"></span>
              </div>

              {/* CREATE ACCOUNT */}
              <button 
                type="button" 
                className="nsg-pill-btn nsg-btn-primary"
                onClick={() => { setError(""); setModalMode("signup"); }}
              >
                <span className="material-symbols-outlined">person_add</span>
                <span>Tạo tài khoản Giảng viên mới</span>
              </button>

              <div className="nsg-terms">
                Bằng cách đăng nhập, bạn đồng ý với Quy chế Đào tạo & Quản lý Giáo án điện tử của Trường Bách khoa Nam Sài Gòn.
              </div>

              {/* SIGN IN PROMPT */}
              <div className="nsg-signin-section">
                <span className="signin-label">Đã có tài khoản hệ thống?</span>
                <button 
                  type="button" 
                  className="nsg-pill-btn nsg-btn-outline"
                  onClick={() => { setError(""); setModalMode("signin"); }}
                >
                  <span className="material-symbols-outlined">login</span>
                  <span>Đăng nhập bằng Email</span>
                </button>
              </div>

              {/* GUEST DEMO */}
              <div className="nsg-guest-section">
                <button 
                  type="button" 
                  className="nsg-pill-btn nsg-btn-guest"
                  onClick={handleGuestSignIn}
                >
                  ⚡ Trải nghiệm ngay không cần đăng nhập (Guest Mode)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL DIALOG (SIGN IN / SIGN UP) */}
      {modalMode && (
        <div className="nsg-modal-overlay" onClick={() => setModalMode(null)}>
          <div className="nsg-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="nsg-modal-header">
              <div className="nsg-modal-brand">
                <span className="nsg-mini-badge">NSG</span>
                <b>{modalMode === 'signup' ? 'Đăng ký tài khoản' : 'Đăng nhập hệ thống'}</b>
              </div>
              <button className="nsg-close-btn" onClick={() => setModalMode(null)}>✕</button>
            </div>

            <div className="nsg-modal-body">
              {error && (
                <div className="nsg-error-banner" style={{ margin: "0 0 16px" }}>
                  <span className="material-symbols-outlined">error</span>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={modalMode === 'signup' ? handleEmailSignUp : handleEmailSignIn}>
                {modalMode === 'signup' && (
                  <div className="nsg-input-group">
                    <label>Họ và tên Giảng viên:</label>
                    <input 
                      type="text" 
                      placeholder="Ví dụ: ThS. Trần Hữu Nhân" 
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      required
                    />
                  </div>
                )}

                <div className="nsg-input-group">
                  <label>Email công tác:</label>
                  <input 
                    type="email" 
                    placeholder="name@bknsg.edu.vn" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="nsg-input-group">
                  <label>Mật khẩu:</label>
                  <input 
                    type="password" 
                    placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="nsg-pill-btn nsg-btn-submit"
                  disabled={loading}
                >
                  {loading ? "Đang xử lý..." : (modalMode === 'signup' ? "Hoàn tất Đăng ký" : "Đăng nhập ngay")}
                </button>
              </form>

              <div className="nsg-modal-footer">
                {modalMode === 'signup' ? (
                  <p>Đã có tài khoản? <span className="nsg-link" onClick={() => { setError(""); setModalMode('signin'); }}>Đăng nhập tại đây</span></p>
                ) : (
                  <p>Chưa có tài khoản? <span className="nsg-link" onClick={() => { setError(""); setModalMode('signup'); }}>Tạo tài khoản mới</span></p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LUMINOUS BRIGHT THEME CSS */}
      <style jsx>{`
        .nsg-auth-wrapper {
          min-height: 100vh;
          background: radial-gradient(circle at 10% 20%, #e0edff 0%, #f0f7ff 40%, #f8fafc 90%);
          color: #1e293b;
          font-family: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px 16px;
        }

        .nsg-auth-container {
          width: 100%;
          max-width: 1220px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 60px;
        }

        /* LEFT BRAND COLUMN */
        .nsg-left-hero {
          flex: 1.1;
          display: flex;
          justify-content: center;
        }

        .nsg-brand-card {
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.9);
          border-radius: 28px;
          padding: 44px 38px;
          box-shadow: 0 20px 50px rgba(22, 70, 157, 0.12), 0 1px 3px rgba(0,0,0,0.05);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          position: relative;
          max-width: 480px;
        }

        .nsg-logo-emblem {
          position: relative;
          width: 170px;
          height: 170px;
          margin-bottom: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .nsg-emblem-inner {
          width: 150px;
          height: 150px;
          border-radius: 36px;
          background: linear-gradient(135deg, #16469d 0%, #1a56db 50%, #0284c7 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: 0 14px 35px rgba(26, 86, 219, 0.35);
          color: #ffffff;
          position: relative;
          z-index: 2;
          transform: rotate(-3deg);
          transition: transform 0.3s ease;
        }

        .nsg-emblem-inner:hover {
          transform: rotate(0deg) scale(1.03);
        }

        .nsg-letters {
          font-size: 50px;
          font-weight: 900;
          letter-spacing: -2px;
          line-height: 1;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }

        .nsg-sub-text {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 2px;
          margin-top: 4px;
          opacity: 0.9;
        }

        .nsg-glow-ring {
          position: absolute;
          top: -10px;
          left: -10px;
          right: -10px;
          bottom: -10px;
          border-radius: 46px;
          background: radial-gradient(circle, rgba(26, 86, 219, 0.25) 0%, rgba(26, 86, 219, 0) 70%);
          z-index: 1;
        }

        .nsg-school-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #e0edff;
          color: #1a56db;
          font-size: 11.5px;
          font-weight: 800;
          padding: 5px 14px;
          border-radius: 9999px;
          margin-bottom: 14px;
          letter-spacing: 0.3px;
        }

        .nsg-school-badge .material-symbols-outlined {
          font-size: 16px;
        }

        .nsg-school-name {
          font-size: 21px;
          font-weight: 900;
          color: #0f2c59;
          letter-spacing: -0.4px;
          line-height: 1.3;
          margin-bottom: 6px;
        }

        .nsg-department {
          font-size: 14.5px;
          color: #475569;
          font-weight: 600;
          margin-bottom: 20px;
        }

        .nsg-app-tag {
          border-top: 1px solid #e2e8f0;
          padding-top: 16px;
          width: 100%;
        }

        .nsg-app-tag b {
          display: block;
          font-size: 14px;
          color: #1e3a8a;
        }

        .nsg-app-tag span {
          font-size: 12px;
          color: #64748b;
          display: block;
          margin-top: 2px;
        }

        /* RIGHT CONTENT CARD */
        .nsg-right-content {
          flex: 1;
          max-width: 540px;
        }

        .nsg-auth-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 28px;
          padding: 44px 40px;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.06);
        }

        .nsg-mobile-header {
          display: none;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
        }

        .nsg-mini-logo {
          background: linear-gradient(135deg, #16469d, #1a56db);
          color: #ffffff;
          font-weight: 900;
          font-size: 16px;
          padding: 8px 12px;
          border-radius: 12px;
        }

        .nsg-mobile-header b {
          font-size: 15px;
          color: #0f2c59;
          display: block;
        }

        .nsg-mobile-header p {
          font-size: 12px;
          color: #64748b;
          margin: 0;
        }

        .nsg-main-title {
          font-size: 34px;
          font-weight: 900;
          color: #0f172a;
          letter-spacing: -0.8px;
          line-height: 1.2;
          margin-bottom: 8px;
        }

        .nsg-sub-title {
          font-size: 14.5px;
          color: #64748b;
          line-height: 1.5;
          margin-bottom: 28px;
        }

        .nsg-actions-box {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .nsg-pill-btn {
          width: 100%;
          height: 48px;
          border-radius: 9999px;
          font-size: 14.5px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          border: 0;
          font-family: inherit;
        }

        .nsg-btn-google {
          background: #ffffff;
          color: #1e293b;
          border: 1px solid #cbd5e1;
          box-shadow: 0 2px 4px rgba(0,0,0,0.04);
        }

        .nsg-btn-google:hover {
          background: #f8fafc;
          border-color: #94a3b8;
          box-shadow: 0 4px 10px rgba(0,0,0,0.08);
          transform: translateY(-1px);
        }

        .google-icon {
          width: 20px;
          height: 20px;
        }

        .nsg-divider {
          display: flex;
          align-items: center;
          margin: 10px 0;
          gap: 12px;
        }

        .nsg-divider-line {
          flex: 1;
          height: 1px;
          background: #e2e8f0;
        }

        .nsg-divider-text {
          color: #94a3b8;
          font-size: 12.5px;
          font-weight: 600;
        }

        .nsg-btn-primary {
          background: linear-gradient(135deg, #16469d 0%, #1a56db 100%);
          color: #ffffff;
          box-shadow: 0 4px 14px rgba(26, 86, 219, 0.3);
        }

        .nsg-btn-primary:hover {
          background: linear-gradient(135deg, #0f3ba1 0%, #16469d 100%);
          box-shadow: 0 6px 18px rgba(26, 86, 219, 0.4);
          transform: translateY(-1px);
        }

        .nsg-terms {
          font-size: 11.5px;
          color: #94a3b8;
          line-height: 1.45;
          text-align: center;
          margin: 6px 0 14px;
        }

        .nsg-signin-section {
          border-top: 1px solid #f1f5f9;
          padding-top: 16px;
        }

        .signin-label {
          display: block;
          font-size: 13px;
          font-weight: 700;
          color: #334155;
          margin-bottom: 10px;
        }

        .nsg-btn-outline {
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          color: #1a56db;
        }

        .nsg-btn-outline:hover {
          background: #eff6ff;
          border-color: #93c5fd;
        }

        .nsg-guest-section {
          margin-top: 10px;
        }

        .nsg-btn-guest {
          background: #f1f5f9;
          color: #475569;
          font-size: 13px;
          font-weight: 600;
          border: 1px solid #e2e8f0;
        }

        .nsg-btn-guest:hover {
          background: #e2e8f0;
          color: #1e293b;
        }

        .nsg-error-banner {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #b91c1c;
          padding: 11px 14px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 16px;
        }

        /* MODAL STYLES */
        .nsg-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.45);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 16px;
        }

        .nsg-modal-box {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 24px;
          width: 100%;
          max-width: 460px;
          box-shadow: 0 25px 60px rgba(15, 23, 42, 0.2);
          overflow: hidden;
          animation: modalPop 0.25s ease-out;
        }

        @keyframes modalPop {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        .nsg-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 24px;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }

        .nsg-modal-brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .nsg-mini-badge {
          background: #1a56db;
          color: #ffffff;
          font-size: 11px;
          font-weight: 800;
          padding: 3px 8px;
          border-radius: 6px;
        }

        .nsg-modal-brand b {
          font-size: 16px;
          color: #0f172a;
        }

        .nsg-close-btn {
          background: transparent;
          border: 0;
          color: #64748b;
          font-size: 16px;
          cursor: pointer;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s;
        }

        .nsg-close-btn:hover {
          background: #e2e8f0;
          color: #0f172a;
        }

        .nsg-modal-body {
          padding: 24px 28px;
        }

        .nsg-input-group {
          margin-bottom: 16px;
        }

        .nsg-input-group label {
          display: block;
          font-size: 13px;
          font-weight: 700;
          color: #334155;
          margin-bottom: 6px;
        }

        .nsg-input-group input {
          width: 100%;
          height: 46px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          padding: 10px 14px;
          color: #0f172a;
          font-size: 14.5px;
          box-sizing: border-box;
          transition: all 0.2s;
        }

        .nsg-input-group input:focus {
          border-color: #1a56db;
          box-shadow: 0 0 0 3px rgba(26, 86, 219, 0.15);
          outline: none;
        }

        .nsg-btn-submit {
          background: linear-gradient(135deg, #16469d 0%, #1a56db 100%);
          color: #ffffff;
          margin-top: 20px;
          height: 48px;
          box-shadow: 0 4px 12px rgba(26, 86, 219, 0.25);
        }

        .nsg-btn-submit:hover {
          background: #0f3ba1;
        }

        .nsg-modal-footer {
          margin-top: 20px;
          text-align: center;
          font-size: 13.5px;
          color: #64748b;
        }

        .nsg-link {
          color: #1a56db;
          cursor: pointer;
          font-weight: 700;
        }

        .nsg-link:hover {
          text-decoration: underline;
        }

        @media (max-width: 960px) {
          .nsg-auth-container {
            flex-direction: column;
            gap: 24px;
          }
          .nsg-left-hero {
            display: none;
          }
          .nsg-mobile-header {
            display: flex;
          }
          .nsg-right-content {
            max-width: 100%;
          }
          .nsg-auth-card {
            padding: 28px 20px;
          }
          .nsg-main-title {
            font-size: 26px;
          }
        }
      `}</style>
    </div>
  );
}