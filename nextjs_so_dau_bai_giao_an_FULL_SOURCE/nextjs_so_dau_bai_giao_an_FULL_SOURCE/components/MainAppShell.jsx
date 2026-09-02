"use client";

import { useEffect, useRef, useState } from "react";

export default function MainAppShell() {
  const plannerRef = useRef(null);
  const step2Ref = useRef(null);
  const [transfer, setTransfer] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      if (e.data?.type !== "OPEN_LESSON_PLAN_FROM_SCHEDULE") return;
      const p = e.data.payload || {};
      setTransfer(p);
      plannerRef.current?.contentWindow?.postMessage(
        { type: "LOAD_SCHEDULE_SESSION", payload: p },
        "*"
      );
      setTimeout(() => {
        step2Ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  return (
    <main className="shell">
      <header className="hero">
        <h1>QUẢN LÝ SỔ ĐẦU BÀI & SOẠN GIÁO ÁN</h1>
        <p>
          Được thiết kế bởi <b>Trần Hữu Nhân</b> - giảng viên khoa CNTT-KTĐ dưới sự hỗ trợ của AI
        </p>
        <div className="steps">
          <div className="step-pill">BƯỚC 1 · Lập Sổ đầu bài</div>
          <div className="step-pill">BƯỚC 2 · Soạn giáo án theo từng buổi</div>
        </div>
      </header>

      <section className="section" id="step1">
        <div className="section-head">
          <div>
            <h2>BƯỚC 1. LẬP SỔ ĐẦU BÀI</h2>
            <p>Sau khi chia lịch, tại từng dòng Sổ đầu bài bấm “SOẠN GIÁO ÁN BUỔI NÀY”.</p>
          </div>
        </div>
        <div className="workflow-note">
          <b>Luồng:</b> Chọn loại môn → Chương trình môn học → Sổ đầu bài → chọn đúng buổi dạy → hệ thống truyền môn, mã môn, ngày dạy, số tiết, LT/TH/KT và nội dung sang Bước 2.
        </div>
        <iframe
          id="scheduleFrame"
          title="Lập Sổ đầu bài"
          src="/frames/schedule.html"
        />
      </section>

      <section className="section" id="step2" ref={step2Ref}>
        <div className="section-head">
          <div>
            <h2>BƯỚC 2. SOẠN GIÁO ÁN TỪ SỔ ĐẦU BÀI</h2>
            <p>
              Bước 2 nhận dữ liệu trực tiếp từ đúng dòng Sổ đầu bài: loại giáo án, giáo án số, ngày dạy, số tiết, nội dung và phần kiểm tra.
            </p>
          </div>
          <div className="actions">
            <button
              className="secondary"
              onClick={() => document.getElementById("step1")?.scrollIntoView({ behavior: "smooth" })}
            >
              ↑ Quay lại Sổ đầu bài
            </button>
          </div>
        </div>

        {transfer && (
          <div id="transferStatus" className="transfer-status">
            Đã chọn <b>{transfer.courseName || ""} – {transfer.courseCode || ""}</b> · {transfer.weekday || ""} {transfer.date || ""} · {transfer.periods || 0} tiết · Giáo án số {transfer.scheduleTT || ""}.
          </div>
        )}

        <iframe
          ref={plannerRef}
          id="plannerFrame"
          title="Soạn giáo án"
          src="/frames/planner.html"
        />
      </section>

      <style jsx>{`
        .shell{max-width:1540px;margin:0 auto;padding:16px}
        .hero{background:#16469d;color:#fff;border-radius:14px;padding:18px 22px;margin-bottom:16px;box-shadow:0 8px 24px rgba(22,70,157,.18)}
        .hero h1{margin:0 0 6px;font-size:26px}.hero p{margin:0;opacity:.95}
        .steps{display:flex;gap:10px;flex-wrap:wrap;margin-top:14px}.step-pill{background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.32);padding:8px 12px;border-radius:999px;font-weight:700}
        .section{background:#fff;border-radius:14px;margin-bottom:18px;box-shadow:0 5px 20px rgba(0,0,0,.07);overflow:hidden}
        .section-head{display:flex;justify-content:space-between;gap:12px;align-items:center;padding:14px 18px;background:#f8fbff;border-bottom:1px solid #d9e2ef}.section-head h2{margin:0;color:#123d82;font-size:20px}.section-head p{margin:4px 0 0;color:#64748b;font-size:13px}
        .actions{display:flex;gap:8px;flex-wrap:wrap}button{font:inherit;border:0;border-radius:8px;padding:9px 12px;font-weight:700;cursor:pointer;background:#16469d;color:#fff}button.secondary{background:#64748b}
        iframe{width:100%;border:0;display:block;background:#fff}#scheduleFrame{height:2350px}#plannerFrame{height:2850px}
        .workflow-note{margin:12px 18px 16px;padding:11px 13px;border-radius:9px;background:#eff6ff;border:1px solid #93c5fd;color:#1e3a8a;font-size:14px}
        .transfer-status{margin:12px 18px;padding:12px;border-radius:9px;background:#ecfdf5;border:1px solid #86efac;color:#166534;font-weight:700}
        @media(max-width:900px){#scheduleFrame{height:2900px}#plannerFrame{height:3300px}}
      `}</style>
    </main>
  );
}
