"use client";

import { 
  BookOpen, 
  TrendingUp, 
  CalendarDays, 
  FileCheck2, 
  FolderGit2 
} from "lucide-react";

export default function QuickStatsGrid({ 
  currentCourse = {}, 
  progressText = "0 / 0 tiết", 
  totalSessionsCount = 0, 
  totalLessonPlansCount = 0, 
  totalWorkSessionsCount = 0 
}) {
  const stats = [
    {
      title: "MÔN ĐANG THỰC HIỆN",
      value: currentCourse.name || "Chưa chọn môn học",
      sub: currentCourse.code ? `Mã: ${currentCourse.code} · ${currentCourse.modeLabel || "Tích hợp"}` : "Vui lòng tải CTMH ở Bước 1",
      icon: BookOpen,
      color: "blue"
    },
    {
      title: "TIẾN ĐỘ GIẢNG DẠY",
      value: progressText,
      sub: "Đã phân bổ theo lịch dạy",
      icon: TrendingUp,
      color: "cyan"
    },
    {
      title: "BUỔI ĐÃ LẬP SĐB",
      value: `${totalSessionsCount} buổi`,
      sub: "Đúng theo thứ và số tiết cố định",
      icon: CalendarDays,
      color: "emerald"
    },
    {
      title: "GIÁO ÁN ĐÃ TẠO",
      value: `${totalLessonPlansCount} giáo án`,
      sub: "Mẫu Phụ lục 10 quy chuẩn",
      icon: FileCheck2,
      color: "indigo"
    },
    {
      title: "PHIÊN LÀM VIỆC",
      value: `${totalWorkSessionsCount} phiên`,
      sub: "Lưu trữ Cloud & CSDL",
      icon: FolderGit2,
      color: "amber"
    }
  ];

  return (
    <div className="stats-grid-container">
      {stats.map((st, i) => {
        const Icon = st.icon;
        return (
          <div key={i} className="stat-card">
            <div className="stat-card-top">
              <span className="stat-title">{st.title}</span>
              <div className={`stat-icon-wrapper ${st.color}`}>
                <Icon size={18} />
              </div>
            </div>
            <div className="stat-value">{st.value}</div>
            <div className="stat-sub">{st.sub}</div>
          </div>
        );
      })}

      <style jsx>{`
        .stats-grid-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 16px;
          margin-bottom: 28px;
        }

        .stat-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(22, 70, 157, 0.08);
          border-color: #cbd5e1;
        }

        .stat-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .stat-title {
          font-size: 11.5px;
          font-weight: 800;
          color: #64748b;
          letter-spacing: 0.5px;
        }

        .stat-icon-wrapper {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-icon-wrapper.blue { background: #e0edff; color: #1a56db; }
        .stat-icon-wrapper.cyan { background: #e0f2fe; color: #0284c7; }
        .stat-icon-wrapper.emerald { background: #dcfce7; color: #059669; }
        .stat-icon-wrapper.indigo { background: #ede9fe; color: #6366f1; }
        .stat-icon-wrapper.amber { background: #fef3c7; color: #d97706; }

        .stat-value {
          font-size: 19px;
          font-weight: 800;
          color: #0f172a;
          line-height: 1.3;
          margin-bottom: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .stat-sub {
          font-size: 12.5px;
          color: #64748b;
          line-height: 1.4;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      `}</style>
    </div>
  );
}