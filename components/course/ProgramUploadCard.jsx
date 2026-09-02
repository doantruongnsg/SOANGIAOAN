"use client";

import { UploadCloud, FileText, CheckCircle, AlertCircle } from "lucide-react";

export default function ProgramUploadCard({ 
  courseInfo = {}, 
  onFileSelect, 
  fileStatus = "Chưa chọn file" 
}) {
  const hasCourse = Boolean(courseInfo.name || courseInfo.code);

  return (
    <div className="upload-section">
      <div className="section-header-box">
        <span className="step-tag">BƯỚC 2</span>
        <h3 className="section-title-text">Tải Chương trình Môn học (.DOCX)</h3>
        <p className="section-desc-text">Hệ thống tự động phân tích tên môn, mã môn, danh mục bài học, số giờ và số tiết quy đổi chuẩn.</p>
      </div>

      <div className="upload-dropzone">
        <input 
          type="file" 
          id="programFileInput" 
          accept=".docx,.txt,.md" 
          onChange={(e) => onFileSelect && e.target.files && onFileSelect(e.target.files[0])}
          className="file-input-hidden"
        />
        <label htmlFor="programFileInput" className="dropzone-label">
          <div className="dropzone-icon-box">
            <UploadCloud size={32} />
          </div>
          <div className="dropzone-text">
            <b>Nhấn để chọn file chương trình môn học</b> hoặc kéo thả file .docx vào đây
          </div>
          <span className="dropzone-hint">Hỗ trợ định dạng Word chuẩn (.docx) do nhà trường ban hành</span>
        </label>
      </div>

      <div className="file-status-bar">
        <FileText size={15} className="status-icon" />
        <span>Trạng thái: <b>{fileStatus}</b></span>
      </div>

      {/* PARSED COURSE SUMMARY (Hiding internal mathematical algorithms as requested) */}
      {hasCourse && (
        <div className="course-summary-grid">
          <div className="summary-item">
            <span className="sum-label">Tên môn học</span>
            <span className="sum-value primary">{courseInfo.name || "—"}</span>
          </div>
          <div className="summary-item">
            <span className="sum-label">Mã môn</span>
            <span className="sum-value">{courseInfo.code || "—"}</span>
          </div>
          <div className="summary-item">
            <span className="sum-label">Tổng số giờ</span>
            <span className="sum-value">{courseInfo.total || "—"} giờ</span>
          </div>
          <div className="summary-item">
            <span className="sum-label">Tổng số tiết hệ thống</span>
            <span className="sum-value highlight">{courseInfo.converted || "—"} tiết</span>
          </div>
        </div>
      )}

      <style jsx>{`
        .upload-section {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 28px;
          margin-bottom: 24px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
        }

        .section-header-box {
          margin-bottom: 20px;
        }

        .step-tag {
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

        .section-title-text {
          font-size: 19px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 4px;
        }

        .section-desc-text {
          font-size: 13.5px;
          color: #64748b;
        }

        .upload-dropzone {
          border: 2px dashed #93c5fd;
          border-radius: 16px;
          background: #f0f7ff;
          padding: 32px 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .upload-dropzone:hover {
          background: #e6f2ff;
          border-color: #1a56db;
        }

        .file-input-hidden {
          display: none;
        }

        .dropzone-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
        }

        .dropzone-icon-box {
          width: 60px;
          height: 60px;
          border-radius: 16px;
          background: #ffffff;
          color: #1a56db;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(26, 86, 219, 0.15);
          margin-bottom: 14px;
        }

        .dropzone-text {
          font-size: 15px;
          color: #1e293b;
          margin-bottom: 6px;
        }

        .dropzone-text b {
          color: #1a56db;
        }

        .dropzone-hint {
          font-size: 12.5px;
          color: #64748b;
        }

        .file-status-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 14px;
          padding: 10px 16px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          font-size: 13px;
          color: #475569;
        }

        .status-icon {
          color: #1a56db;
        }

        .course-summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 14px;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #e2e8f0;
        }

        .summary-item {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 14px 16px;
        }

        .sum-label {
          display: block;
          font-size: 11.5px;
          font-weight: 700;
          color: #64748b;
          margin-bottom: 4px;
        }

        .sum-value {
          font-size: 16px;
          font-weight: 800;
          color: #0f172a;
        }

        .sum-value.primary { color: #1a56db; }
        .sum-value.highlight { color: #059669; }
      `}</style>
    </div>
  );
}