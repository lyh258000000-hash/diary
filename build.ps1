#!/usr/bin/env pwsh
set -e

Write-Host "安装前端依赖..." -ForegroundColor Green
cd frontend
npm install
cd ..

Write-Host "构建前端..." -ForegroundColor Green
cd frontend
npm run build
cd ..

Write-Host "安装根目录依赖..." -ForegroundColor Green
npm install

Write-Host "构建完成！" -ForegroundColor Green
