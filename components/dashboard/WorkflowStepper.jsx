"use client";

import { Check, ChevronRight } from "lucide-react";

export default function WorkflowStepper({ currentStep = 1, onStepClick }) {
  const steps = [
    { num: "01", title: "CHỌN LOẠI MÔN", id: "course-type" },
    { num: "02", title: "TẢI CHƯƠNG TRÌNH", id: "upload-program" },
    { num: "03", title: "THIẾT LẬP LỊCH", id: "schedule-config" },
    { num: "04", title: "LẬP SỔ ĐẦU BÀI", id: "step1" },
    { num: "05", title: "SOẠN GIÁO ÁN", id: "step2" },
    { num: "06", title: "AI HOÀN THIỆN", id: "ai" },
  ];

  return (
    <div className="stepper-wrapper">
      <div className="stepper-inner">
        {steps.map((st, i) => {
          const stepNum = i + 1;
          const isDone = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;

          return (
            <div key={st.num} className="step-item-container">
              <div 
                className={`step-card ${isCurrent ? "current" : ""} ${isDone ? "done" : ""}`}
                onClick={() => onStepClick && onStepClick(st.id)}
              >
                <div className="step-num-badge">
                  {isDone ? <Check size={14} /> : st.num}
                </div>
                <div className="step-title-text">{st.title}</div>
              </div>
              {i < steps.length - 1 && (
                <div className="step-arrow">
                  <ChevronRight size={16} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .stepper-wrapper {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 14px 20px;
          margin-bottom: 28px;
          overflow-x: auto;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
        }

        .stepper-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-width: 860px;
          gap: 10px;
        }

        .step-item-container {
          display: flex;
          align-items: center;
          gap: 10px;
          flex: 1;
        }

        .step-card {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 14px;
          border-radius: 10px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          cursor: pointer;
          transition: all 0.2s;
          flex: 1;
        }

        .step-card:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
        }

        .step-card.current {
          background: linear-gradient(135deg, #1a56db 0%, #0284c7 100%);
          border-color: #1a56db;
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(26, 86, 219, 0.25);
        }

        .step-card.done {
          background: #ecfdf5;
          border-color: #86efac;
          color: #065f46;
        }

        .step-num-badge {
          width: 24px;
          height: 24px;
          border-radius: 6px;
          background: rgba(0, 0, 0, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 800;
        }

        .step-card.current .step-num-badge {
          background: rgba(255, 255, 255, 0.25);
          color: #ffffff;
        }

        .step-card.done .step-num-badge {
          background: #059669;
          color: #ffffff;
        }

        .step-title-text {
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.2px;
          white-space: nowrap;
        }

        .step-arrow {
          color: #94a3b8;
        }
      `}</style>
    </div>
  );
}