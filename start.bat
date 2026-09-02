@echo off
chcp 65001 > nul
title Quan Ly So Dau Bai & Soan Giao An - BKNSG

echo ======================================================================
echo    HỆ THỐNG QUẢN LÝ SỔ ĐẦU BÀI & SOẠN GIÁO ÁN (FULL BACKEND)
echo    Trường Cao đẳng Bách khoa Nam Sài Gòn
echo    Tác giả: Trần Hữu Nhân - Khoa CNTT-KTĐ
echo ======================================================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [LỖI] Không tìm thấy Node.js trên máy tính của bạn!
    echo Vui lòng tải và cài đặt Node.js từ https://nodejs.org
    pause
    exit /b 1
)

if not exist "node_modules" (
    echo [THÔNG BÁO] Đang cài đặt thư viện cần thiết...
    call npm install
)

echo [OK] Đang khởi động máy chủ ứng dụng...
start "" http://localhost:3000
node server.js

pause
