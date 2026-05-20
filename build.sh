#!/bin/bash
set -e

echo "安装前端依赖..."
cd frontend && npm install && cd ..

echo "构建前端..."
cd frontend && npm run build && cd ..

echo "安装根目录依赖..."
npm install

echo "构建完成！"
