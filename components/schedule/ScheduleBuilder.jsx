"use client";

import { Calendar, Plus, Trash2, ShieldAlert, Sparkles, Clock } from "lucide-react";

export default function ScheduleBuilder({ 
  startDate, 
  onStartDateChange, 
  slots = [], 
  onSlotChange, 
  onAddSlot, 
  onRemoveSlot,
  exclusions = [],
  onAddExclusion,
  onRemoveExclusion
}) {
  return (
    <div className="schedule-builder-section">
      <div className="section-header-box">
        <span className="step-tag">BƯỚC 3</span>
        <h3 className="section-title-text">Thiết lập Lịch học & Ngày nghỉ</h3>
        <p className="section-desc-text">Cấu hình ngày bắt đầu học kỳ, các thứ trong tuần kèm số tiết cố định và danh sách các ngày nghỉ lễ/nghỉ bù.</p>
      </div>

      <div className="builder-grid">
        {/* LEFT: WEEKLY SLOTS */}
        <div className="builder-card">
          <div className="card-heading">
            <Calendar size={18} className="icon-blue" />
            <h4>1. Lịch học các buổi trong tuần</h4>
          </div>

          <div className="date-input-group">
            <label>Ngày bắt đầu học kỳ (DD/MM/YYYY):</label>
            <input 
              type="text" 
              placeholder="Ví dụ: 03/09/2026" 
              value={startDate || ""}
              onChange={(e) => onStartDateChange && onStartDateChange(e.target.value)}
              className="std-input"
            />
          </div>

          <div className="slots-label-row">
            <label>Các buổi học cố định trong tuần:</label>
            <button type="button" className="btn-add-slot" onClick={onAddSlot}>
              <Plus size={14} />
              <span>Thêm buổi</span>
            </button>
          </div>

          <div className="slots-container">
            {slots.length === 0 ? (
              <div className="empty-slot-msg">Chưa có buổi học nào. Nhấn "+ Thêm buổi" để thiết lập.</div>
            ) : (
              slots.map((slot, idx) => (
                <div key={idx} className="slot-item-pill">
                  <div className="slot-day-badge">
                    <Clock size={13} />
                    <span>{slot.weekdayName || `Thứ ${slot.weekday || 2}`}</span>
                  </div>
                  <span className="slot-periods-count"><b>{slot.periods || 4}</b> tiết</span>
                  <button 
                    type="button" 
                    className="btn-del-slot"
                    onClick={() => onRemoveSlot && onRemoveSlot(idx)}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT: HOLIDAYS & EXCLUSIONS */}
        <div className="builder-card">
          <div className="card-heading">
            <ShieldAlert size={18} className="icon-amber" />
            <h4>2. Ngày nghỉ lễ & Kế hoạch trường</h4>
          </div>

          <p className="card-tip">Hệ thống sẽ tự động bỏ qua các ngày này khi chia Sổ đầu bài và không chuyển quota tiết.</p>

          <div className="exclusions-list-box">
            {exclusions.length === 0 ? (
              <div className="empty-exclusion-msg">Chưa có ngày nghỉ nào trong danh sách.</div>
            ) : (
              exclusions.map((ex, idx) => (
                <div key={idx} className="exclusion-tag-item">
                  <span className="ex-date"><b>{ex.startDate || ex.date}</b> {ex.endDate ? `→ ${ex.endDate}` : ""}</span>
                  <span className="ex-reason">{ex.reason || "Nghỉ lễ"}</span>
                  <span className={`ex-type-badge ${ex.type || "holiday"}`}>
                    {ex.type === "school" ? "Trường" : "Nghỉ Lễ"}
                  </span>
                  <button 
                    type="button" 
                    className="btn-del-ex"
                    onClick={() => onRemoveExclusion && onRemoveExclusion(idx)}
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .schedule-builder-section {
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

        .builder-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .builder-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 22px;
        }

        .card-heading {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
        }

        .card-heading h4 {
          font-size: 15px;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }

        .icon-blue { color: #1a56db; }
        .icon-amber { color: #d97706; }

        .date-input-group {
          margin-bottom: 16px;
        }

        .date-input-group label, .slots-label-row label {
          display: block;
          font-size: 12.5px;
          font-weight: 700;
          color: #334155;
          margin-bottom: 6px;
        }

        .std-input {
          width: 100%;
          height: 42px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 13.5px;
          box-sizing: border-box;
        }

        .slots-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
        }

        .btn-add-slot {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: #e0edff;
          color: #1a56db;
          border: 0;
          border-radius: 6px;
          padding: 4px 10px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .btn-add-slot:hover {
          background: #d0e4ff;
        }

        .slots-container {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .slot-item-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          padding: 6px 12px;
          border-radius: 9999px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.03);
        }

        .slot-day-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #1a56db;
          font-weight: 800;
          font-size: 13px;
        }

        .slot-periods-count {
          font-size: 12.5px;
          color: #475569;
        }

        .btn-del-slot {
          background: transparent;
          border: 0;
          color: #94a3b8;
          cursor: pointer;
          display: flex;
          align-items: center;
        }

        .btn-del-slot:hover {
          color: #ef4444;
        }

        .card-tip {
          font-size: 12.5px;
          color: #64748b;
          margin-bottom: 14px;
        }

        .exclusions-list-box {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .exclusion-tag-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          padding: 8px 14px;
          border-radius: 10px;
          font-size: 12.5px;
        }

        .ex-date {
          color: #0f172a;
        }

        .ex-reason {
          color: #475569;
          font-weight: 500;
        }

        .ex-type-badge {
          padding: 2px 8px;
          border-radius: 9999px;
          font-size: 11px;
          font-weight: 700;
        }

        .ex-type-badge.holiday { background: #fee2e2; color: #991b1b; }
        .ex-type-badge.school { background: #ede9fe; color: #5b21b6; }

        .btn-del-ex {
          background: transparent;
          border: 0;
          color: #94a3b8;
          cursor: pointer;
          font-weight: 800;
        }

        .btn-del-ex:hover {
          color: #ef4444;
        }

        .empty-slot-msg, .empty-exclusion-msg {
          font-size: 12.5px;
          color: #94a3b8;
          font-style: italic;
          padding: 8px 0;
        }

        @media (max-width: 900px) {
          .builder-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}