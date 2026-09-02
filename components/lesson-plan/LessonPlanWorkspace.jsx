"use client";

import { useState } from "react";
import { 
  FileText, 
  Clock, 
  Sparkles, 
  FileDown, 
  Printer, 
  CheckCircle2, 
  ZoomIn, 
  ZoomOut, 
  Maximize2,
  Calendar,
  Layers,
  BookOpen
} from "lucide-react";

export default function LessonPlanWorkspace({ 
  transferData = {}, 
  onCheckTime, 
  onRunAI, 
  onExportWord, 
  onExportPdf, 
  onPrint,
  plannerFrameRef,
  plannerHeight = 2800
}) {
  const [zoomLevel, setZoomLevel] = useState(100);

  const handleZoomIn = () => setZoomLevel((z) => Math.min(150, z + 10));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(70, z - 10));
  const handleResetZoom = () => setZoomLevel(100);

  return (
    <div className="workspace-container">
      {/* 30% LEFT SIDEBAR: SESSION METADATA */}
      <aside className="workspace-sidebar">
        <div className="sidebar-card">
          <div className="sidebar-header">
            <span className="sidebar-tag">THÔNG TIN BUỔI HỌC</span>
            <h4>Nhận từ Sổ đầu bài</h4>
            <p className="sidebar-sub">Dữ liệu được khóa theo dòng Sổ đầu bài tương ứng để đảm bảo tính nhất quán.</p>
          </div>

          <div className="meta-list">
            <div className="meta-item">
              <span className="meta-label">Giáo án số:</span>
              <span className="meta-val badge-ga">Số {transferData.scheduleTT || "01"}</span>
            </div>

            <div className="meta-item">
              <span className="meta-label">Ngày thực hiện:</span>
              <span className="meta-val">{transferData.weekday || ""} {transferData.date || "Chưa chọn"}</span>
            </div>

            <div className="meta-item">
              <span className="meta-label">Môn học – Mã môn:</span>
              <span className="meta-val bold-val">{transferData.courseName || "Chưa nạp"} {transferData.courseCode ? `(${transferData.courseCode})` : ""}</span>
            </div>

            <div className="meta-item">
              <span className="meta-label">Loại giáo án:</span>
              <span className="meta-val highlight-val">{transferData.planType || "Giáo án Tích hợp"}</span>
            </div>

            <div className="meta-item">
              <span className="meta-label">Thời lượng buổi dạy:</span>
              <span className="meta-val"><b>{transferData.periods || 4}</b> tiết ({(transferData.periods || 4) * 45} phút)</span>
            </div>

            <div className="meta-item-block">
              <span className="meta-label">Tên bài học trước:</span>
              <div className="prev-lesson-box">
                {transferData.prevLesson || (transferData.scheduleTT === 1 ? "TT 1: Để trống" : "Tự động lấy từ buổi liền trước")}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* 70% RIGHT DOCUMENT WORKSPACE */}
      <main className="document-main">
        {/* DOCUMENT TOOLBAR */}
        <div className="doc-toolbar">
          <div className="toolbar-left">
            <div className="zoom-controls">
              <button className="tool-btn-icon" onClick={handleZoomOut} title="Thu nhỏ">
                <ZoomOut size={15} />
              </button>
              <span className="zoom-indicator" onClick={handleResetZoom}>{zoomLevel}%</span>
              <button className="tool-btn-icon" onClick={handleZoomIn} title="Phóng to">
                <ZoomIn size={15} />
              </button>
            </div>
          </div>

          <div className="toolbar-actions">
            <button className="tool-btn" onClick={onCheckTime}>
              <Clock size={15} className="icon-blue" />
              <span>Kiểm tra thời gian 45p</span>
            </button>

            <button className="tool-btn highlight-ai" onClick={onRunAI}>
              <Sparkles size={15} />
              <span>Gemini Hoàn thiện</span>
            </button>

            <button className="tool-btn success" onClick={onExportWord}>
              <FileDown size={15} />
              <span>Xuất Word (.doc)</span>
            </button>

            <button className="tool-btn outline" onClick={onExportPdf}>
              <FileText size={15} />
              <span>Xuất PDF</span>
            </button>

            <button className="tool-btn outline" onClick={onPrint}>
              <Printer size={15} />
              <span>In A4</span>
            </button>
          </div>
        </div>

        {/* PAPER CANVAS */}
        <div className="paper-canvas-area">
          <div 
            className="paper-scale-wrapper"
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}
          >
            <iframe
              ref={plannerFrameRef}
              id="plannerFrame"
              title="Soạn giáo án Phụ lục 10"
              src="/frames/planner.html"
              style={{ height: `${plannerHeight}px` }}
            />
          </div>
        </div>
      </main>

      <style jsx>{`
        .workspace-container {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 20px;
          margin-bottom: 24px;
        }

        /* LEFT SIDEBAR */
        .workspace-sidebar {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .sidebar-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
        }

        .sidebar-header {
          margin-bottom: 20px;
        }

        .sidebar-tag {
          display: inline-block;
          background: #e0edff;
          color: #1a56db;
          font-size: 11px;
          font-weight: 800;
          padding: 3px 10px;
          border-radius: 6px;
          margin-bottom: 8px;
          letter-spacing: 0.5px;
        }

        .sidebar-header h4 {
          font-size: 17px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 4px;
        }

        .sidebar-sub {
          font-size: 12.5px;
          color: #64748b;
          line-height: 1.4;
        }

        .meta-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .meta-item {
          display: flex;
          flex-direction: column;
          gap: 3px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 10px 12px;
        }

        .meta-label {
          font-size: 11.5px;
          font-weight: 700;
          color: #64748b;
        }

        .meta-val {
          font-size: 13.5px;
          font-weight: 600;
          color: #0f172a;
        }

        .badge-ga {
          display: inline-block;
          color: #1a56db;
          font-weight: 800;
        }

        .bold-val {
          font-weight: 700;
          color: #0f2c59;
        }

        .highlight-val {
          color: #059669;
          font-weight: 700;
        }

        .meta-item-block {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 10px 12px;
        }

        .prev-lesson-box {
          font-size: 12.5px;
          color: #334155;
          margin-top: 4px;
          line-height: 1.4;
          font-style: italic;
        }

        /* RIGHT DOCUMENT MAIN */
        .document-main {
          display: flex;
          flex-direction: column;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
        }

        .doc-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 20px;
          background: #0f172a;
          color: #ffffff;
          flex-wrap: wrap;
          gap: 12px;
        }

        .toolbar-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .zoom-controls {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 3px 8px;
          border-radius: 8px;
        }

        .tool-btn-icon {
          background: transparent;
          border: 0;
          color: #ffffff;
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 4px;
          border-radius: 4px;
        }

        .tool-btn-icon:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        .zoom-indicator {
          font-size: 12px;
          font-weight: 700;
          color: #38bdf8;
          cursor: pointer;
          min-width: 40px;
          text-align: center;
        }

        .toolbar-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .tool-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border-radius: 8px;
          font-size: 12.5px;
          font-weight: 700;
          cursor: pointer;
          border: 0;
          transition: all 0.2s;
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
        }

        .tool-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-1px);
        }

        .tool-btn.highlight-ai {
          background: linear-gradient(135deg, #2563eb 0%, #38bdf8 100%);
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
        }

        .tool-btn.success {
          background: #059669;
        }

        .tool-btn.success:hover {
          background: #047857;
        }

        .tool-btn.outline {
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .paper-canvas-area {
          background: #f1f5f9;
          padding: 30px 16px;
          overflow-x: auto;
          display: flex;
          justify-content: center;
        }

        .paper-scale-wrapper {
          width: 100%;
          max-width: 1050px;
          transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        iframe {
          width: 100%;
          border: 0;
          display: block;
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        @media (max-width: 1024px) {
          .workspace-container { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}