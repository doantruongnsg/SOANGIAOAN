"use client";

import { Sparkles, Bot, Zap, Check, RefreshCw, Key } from "lucide-react";

export default function AIAssistantCard({ 
  apiKey, 
  onApiKeyChange, 
  model = "gemini-3.7-flash", 
  onModelChange, 
  onTestConnection, 
  onRunWholeAI,
  aiStatus = "Sẵn sàng"
}) {
  return (
    <div className="ai-assistant-section">
      <div className="section-header-box">
        <div className="header-left">
          <span className="step-tag-ai">TRỢ LÝ AI GOOGLE GEMINI</span>
          <h3 className="section-title-text">Cấu hình & Trợ lý Hoàn thiện Giáo án AI</h3>
          <p className="section-desc-text">Tự động phát triển hoạt động dạy học, tình huống sư phạm, câu hỏi trắc nghiệm và thang đánh giá theo chuẩn Phụ lục 10.</p>
        </div>
        <div className="ai-badge-status">
          <Sparkles size={16} className="ai-spark-icon" />
          <span>{aiStatus}</span>
        </div>
      </div>

      <div className="ai-controls-grid">
        <div className="ai-input-box">
          <label><Key size={13} /> Google Gemini API Key:</label>
          <input 
            type="password" 
            placeholder="AIzaSy... (Để trống nếu dùng API key máy chủ)" 
            value={apiKey || ""}
            onChange={(e) => onApiKeyChange && onApiKeyChange(e.target.value)}
            className="ai-std-input"
          />
        </div>

        <div className="ai-input-box">
          <label><Bot size={13} /> Model Gemini:</label>
          <select 
            value={model} 
            onChange={(e) => onModelChange && onModelChange(e.target.value)}
            className="ai-std-select"
          >
            <option value="gemini-3.7-flash">gemini-3.7-flash (Khuyến nghị)</option>
            <option value="gemini-2.0-flash">gemini-2.0-flash (Tốc độ cao)</option>
            <option value="gemini-1.5-pro">gemini-1.5-pro (Mô hình sâu)</option>
          </select>
        </div>
      </div>

      <div className="ai-buttons-toolbar">
        <button type="button" className="btn-ai-action primary" onClick={onRunWholeAI}>
          <Sparkles size={16} />
          <span>Gemini Hoàn thiện toàn bộ giáo án</span>
        </button>

        <button type="button" className="btn-ai-action outline" onClick={onTestConnection}>
          <Zap size={15} />
          <span>Kiểm tra kết nối Gemini</span>
        </button>
      </div>

      <style jsx>{`
        .ai-assistant-section {
          background: linear-gradient(135deg, #0b132b 0%, #0f172a 100%);
          border: 1px solid rgba(56, 189, 248, 0.25);
          border-radius: 20px;
          padding: 28px;
          margin-bottom: 24px;
          color: #ffffff;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .section-header-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 22px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .step-tag-ai {
          display: inline-block;
          background: rgba(56, 189, 248, 0.15);
          border: 1px solid rgba(56, 189, 248, 0.4);
          color: #38bdf8;
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
          color: #ffffff;
          margin-bottom: 4px;
        }

        .section-desc-text {
          font-size: 13.5px;
          color: #94a3b8;
        }

        .ai-badge-status {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          padding: 6px 14px;
          border-radius: 9999px;
          font-size: 12.5px;
          font-weight: 700;
          color: #38bdf8;
        }

        .ai-spark-icon {
          color: #38bdf8;
        }

        .ai-controls-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 20px;
        }

        .ai-input-box label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12.5px;
          font-weight: 700;
          color: #cbd5e1;
          margin-bottom: 6px;
        }

        .ai-std-input, .ai-std-select {
          width: 100%;
          height: 44px;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 8px;
          padding: 8px 12px;
          color: #ffffff;
          font-size: 13.5px;
          box-sizing: border-box;
        }

        .ai-std-input:focus, .ai-std-select:focus {
          border-color: #38bdf8;
          outline: none;
        }

        .ai-buttons-toolbar {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .btn-ai-action {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          height: 42px;
          border-radius: 10px;
          padding: 0 20px;
          font-size: 13.5px;
          font-weight: 700;
          cursor: pointer;
          border: 0;
          transition: all 0.2s;
        }

        .btn-ai-action.primary {
          background: linear-gradient(135deg, #2563eb 0%, #38bdf8 100%);
          color: #ffffff;
          box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4);
        }

        .btn-ai-action.primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(37, 99, 235, 0.55);
        }

        .btn-ai-action.outline {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #ffffff;
        }

        .btn-ai-action.outline:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        @media (max-width: 768px) {
          .ai-controls-grid { grid-template-columns: 1fr; }
          .btn-ai-action { width: 100%; justify-content: center; }
        }
      `}</style>
    </div>
  );
}