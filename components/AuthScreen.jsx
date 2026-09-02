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
    <div className="x-auth-wrapper">
      <div className="x-auth-container">
        {/* LEFT COLUMN: BRAND LOGO */}
        <div className="x-left-hero">
          <div className="x-logo-box">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="x-logo-svg">
              <path fill="#ffffff" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <div className="x-school-tag">
              <span>Trường Cao đẳng Bách khoa Nam Sài Gòn</span>
              <b>Hệ thống Quản lý Sổ đầu bài & Soạn giáo án Phụ lục 10</b>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: AUTH ACTIONS */}
        <div className="x-right-content">
          <div className="x-auth-form-box">
            <div className="x-mobile-logo">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="x-mobile-logo-svg">
                <path fill="#ffffff" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </div>

            <h1 className="x-main-heading">Đang diễn ra ngay bây giờ</h1>
            <h2 className="x-sub-heading">Tham gia hôm nay.</h2>

            {error && (
              <div className="x-error-banner">
                <span className="material-symbols-outlined">error</span>
                <span>{error}</span>
              </div>
            )}

            <div className="x-action-buttons">
              {/* GOOGLE SIGN IN */}
              <button 
                type="button" 
                className="x-pill-btn x-btn-google"
                onClick={handleGoogleSignIn}
                disabled={loading}
              >
                <svg className="google-icon" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Đăng ký / Đăng nhập bằng Google</span>
              </button>

              {/* DIVIDER */}
              <div className="x-divider">
                <span className="x-divider-line"></span>
                <span className="x-divider-text">hoặc</span>
                <span className="x-divider-line"></span>
              </div>

              {/* CREATE ACCOUNT BUTTON */}
              <button 
                type="button" 
                className="x-pill-btn x-btn-primary"
                onClick={() => { setError(""); setModalMode("signup"); }}
              >
                Tạo tài khoản giảng viên
              </button>

              <p className="x-terms-text">
                Bằng cách đăng ký, bạn đồng ý với <a href="#terms">Điều khoản Dịch vụ</a> và <a href="#privacy">Chính sách Quyền riêng tư</a> của Khoa CNTT - KTĐ.
              </p>

              {/* ALREADY HAVE ACCOUNT */}
              <div className="x-signin-prompt">
                <h3>Đã có tài khoản?</h3>
                <button 
                  type="button" 
                  className="x-pill-btn x-btn-outline"
                  onClick={() => { setError(""); setModalMode("signin"); }}
                >
                  Đăng nhập
                </button>
              </div>

              {/* GUEST DEMO ACCESS */}
              <div className="x-guest-box">
                <button 
                  type="button" 
                  className="x-pill-btn x-btn-guest"
                  onClick={handleGuestSignIn}
                >
                  ⚡ Trải nghiệm ngay không cần tài khoản (Guest Mode)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL DIALOG (SIGN IN / SIGN UP) */}
      {modalMode && (
        <div className="x-modal-overlay" onClick={() => setModalMode(null)}>
          <div className="x-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="x-modal-header">
              <button className="x-close-btn" onClick={() => setModalMode(null)}>✕</button>
              <div className="x-modal-logo">
                <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: 28, height: 28 }}>
                  <path fill="#ffffff" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </div>
              <div style={{ width: 28 }}></div>
            </div>

            <div className="x-modal-body">
              <h2 className="x-modal-title">
                {modalMode === 'signup' ? 'Tạo tài khoản giảng viên' : 'Đăng nhập vào hệ thống'}
              </h2>

              {error && (
                <div className="x-error-banner" style={{ margin: "12px 0 16px" }}>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={modalMode === 'signup' ? handleEmailSignUp : handleEmailSignIn}>
                {modalMode === 'signup' && (
                  <div className="x-input-group">
                    <input 
                      type="text" 
                      placeholder="Họ và tên giảng viên" 
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      required
                    />
                  </div>
                )}

                <div className="x-input-group">
                  <input 
                    type="email" 
                    placeholder="Email công tác (ví dụ: gv@bknsg.edu.vn)" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="x-input-group">
                  <input 
                    type="password" 
                    placeholder="Mật khẩu" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="x-pill-btn x-btn-modal-submit"
                  disabled={loading}
                >
                  {loading ? "Đang xử lý..." : (modalMode === 'signup' ? "Đăng ký" : "Đăng nhập")}
                </button>
              </form>

              <div className="x-modal-footer">
                {modalMode === 'signup' ? (
                  <p>Đã có tài khoản? <span className="x-link" onClick={() => { setError(""); setModalMode('signin'); }}>Đăng nhập</span></p>
                ) : (
                  <p>Chưa có tài khoản? <span className="x-link" onClick={() => { setError(""); setModalMode('signup'); }}>Đăng ký ngay</span></p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* X AESTHETIC CSS */}
      <style jsx>{`
        .x-auth-wrapper {
          min-height: 100vh;
          background-color: #000000;
          color: #e7e9ea;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .x-auth-container {
          width: 100%;
          max-width: 1200px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 60px;
        }

        .x-left-hero {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .x-logo-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
        }

        .x-logo-svg {
          width: 280px;
          height: 280px;
          filter: drop-shadow(0 0 40px rgba(29, 155, 240, 0.25));
        }

        .x-school-tag {
          text-align: center;
          color: #71767b;
          font-size: 14px;
          max-width: 320px;
          line-height: 1.5;
        }

        .x-school-tag b {
          display: block;
          color: #1d9bf0;
          margin-top: 6px;
          font-size: 15px;
        }

        .x-right-content {
          flex: 1;
          max-width: 580px;
        }

        .x-mobile-logo {
          display: none;
          margin-bottom: 24px;
        }

        .x-mobile-logo-svg {
          width: 44px;
          height: 44px;
        }

        .x-main-heading {
          font-size: 54px;
          font-weight: 800;
          letter-spacing: -1.2px;
          line-height: 1.15;
          margin-bottom: 36px;
          color: #f7f9f9;
        }

        .x-sub-heading {
          font-size: 28px;
          font-weight: 800;
          letter-spacing: -0.5px;
          margin-bottom: 28px;
          color: #f7f9f9;
        }

        .x-action-buttons {
          max-width: 340px;
        }

        .x-pill-btn {
          width: 100%;
          height: 42px;
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

        .x-btn-google {
          background-color: #ffffff;
          color: #0f1419;
          border: 1px solid #dadce0;
        }

        .x-btn-google:hover {
          background-color: #e6e6e6;
        }

        .google-icon {
          width: 19px;
          height: 19px;
        }

        .x-divider {
          display: flex;
          align-items: center;
          margin: 16px 0;
          gap: 10px;
        }

        .x-divider-line {
          flex: 1;
          height: 1px;
          background-color: #2f3336;
        }

        .x-divider-text {
          color: #71767b;
          font-size: 14px;
        }

        .x-btn-primary {
          background-color: #1d9bf0;
          color: #ffffff;
        }

        .x-btn-primary:hover {
          background-color: #1a8cd8;
        }

        .x-terms-text {
          font-size: 11px;
          color: #71767b;
          line-height: 1.45;
          margin: 10px 0 36px;
        }

        .x-terms-text a {
          color: #1d9bf0;
          text-decoration: none;
        }

        .x-terms-text a:hover {
          text-decoration: underline;
        }

        .x-signin-prompt {
          margin-top: 24px;
        }

        .x-signin-prompt h3 {
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 14px;
          color: #e7e9ea;
        }

        .x-btn-outline {
          background-color: transparent;
          border: 1px solid #536471;
          color: #1d9bf0;
        }

        .x-btn-outline:hover {
          background-color: rgba(29, 155, 240, 0.1);
        }

        .x-guest-box {
          margin-top: 24px;
          border-top: 1px dashed #2f3336;
          padding-top: 18px;
        }

        .x-btn-guest {
          background-color: #16181c;
          border: 1px solid #2f3336;
          color: #e7e9ea;
          font-size: 13.5px;
        }

        .x-btn-guest:hover {
          background-color: #202327;
          border-color: #536471;
        }

        .x-error-banner {
          display: flex;
          align-items: center;
          gap: 8px;
          background-color: #451214;
          border: 1px solid #f4212e;
          color: #ffffff;
          padding: 10px 14px;
          border-radius: 12px;
          font-size: 13px;
          margin-bottom: 16px;
        }

        /* MODAL STYLES */
        .x-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(91, 112, 131, 0.4);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 16px;
        }

        .x-modal-box {
          background-color: #000000;
          border: 1px solid #2f3336;
          border-radius: 18px;
          width: 100%;
          max-width: 500px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8);
          overflow: hidden;
          animation: modalPop 0.25s ease-out;
        }

        @keyframes modalPop {
          from { opacity: 0; transform: scale(0.94); }
          to { opacity: 1; transform: scale(1); }
        }

        .x-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 18px;
        }

        .x-close-btn {
          background: transparent;
          border: 0;
          color: #e7e9ea;
          font-size: 18px;
          cursor: pointer;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .x-close-btn:hover {
          background-color: rgba(239, 243, 244, 0.1);
        }

        .x-modal-body {
          padding: 16px 36px 36px;
        }

        .x-modal-title {
          font-size: 26px;
          font-weight: 800;
          margin-bottom: 24px;
          color: #f7f9f9;
        }

        .x-input-group {
          margin-bottom: 16px;
        }

        .x-input-group input {
          width: 100%;
          height: 52px;
          background-color: #000000;
          border: 1px solid #333639;
          border-radius: 6px;
          padding: 12px 14px;
          color: #ffffff;
          font-size: 16px;
          box-sizing: border-box;
          transition: border-color 0.2s;
        }

        .x-input-group input:focus {
          border-color: #1d9bf0;
          outline: none;
        }

        .x-btn-modal-submit {
          background-color: #eff3f4;
          color: #0f1419;
          margin-top: 24px;
          height: 48px;
        }

        .x-btn-modal-submit:hover {
          background-color: #d7dbdc;
        }

        .x-modal-footer {
          margin-top: 24px;
          text-align: center;
          font-size: 14px;
          color: #71767b;
        }

        .x-link {
          color: #1d9bf0;
          cursor: pointer;
          font-weight: 600;
        }

        .x-link:hover {
          text-decoration: underline;
        }

        @media (max-width: 900px) {
          .x-auth-container {
            flex-direction: column;
            gap: 20px;
          }
          .x-left-hero {
            display: none;
          }
          .x-mobile-logo {
            display: block;
          }
          .x-main-heading {
            font-size: 38px;
          }
          .x-sub-heading {
            font-size: 22px;
          }
          .x-action-buttons {
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
}