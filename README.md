# 小小日记

一个简洁美观的全栈日记应用，使用 Vue3 + Express + MySQL 构建，支持部署到 Vercel。

## 功能特性

- ✅ 写日记：创建新的日记
- ✅ 编辑日记：修改已有的日记
- ✅ 删除日记：删除不需要的日记
- ✅ 天气和心情记录：记录当天的天气和心情
- ✅ 响应式设计：适配手机和电脑
- ✅ 美观界面：渐变背景 + 卡片设计

## 技术栈

- **前端**：Vue3 + Vite + HTML5 + CSS3 + JavaScript
- **后端**：Node.js + Express + MySQL
- **部署**：Vercel

## 项目结构

```
小小日记/
├── backend/           # 后端目录
│   ├── index.js       # 后端主文件
│   ├── package.json   # 后端依赖
│   └── .env.example   # 环境变量示例
├── frontend/          # 前端目录
│   ├── index.html     # HTML入口
│   ├── main.js        # JS入口
│   ├── App.vue        # Vue主组件
│   ├── style.css      # 样式文件
│   ├── vite.config.js # Vite配置
│   └── package.json   # 前端依赖
├── package.json       # 项目根依赖
├── vercel.json        # Vercel配置
└── README.md          # 项目说明
```

## 快速开始

### 前置要求

- Node.js (v14+)
- MySQL 数据库

### 1. 安装依赖

```bash
npm run install:all
```

或者分别安装：

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2. 配置数据库

1. 在 MySQL 中创建数据库 `xiaoxiao_diary`
2. 在 `backend/` 目录下创建 `.env` 文件，参考 `.env.example`：

```env
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=你的密码
MYSQL_DATABASE=xiaoxiao_diary
PORT=3000
```

### 3. 启动项目

**启动后端（端口 3000）：**
```bash
npm run dev:backend
```

**启动前端（端口 5173）：**
```bash
npm run dev:frontend
```

### 4. 访问应用

打开浏览器访问：http://localhost:5173

## 部署到 Vercel

### 1. 前端部署

1. 将项目推送到 GitHub/GitLab 仓库
2. 在 Vercel 中导入项目
3. 配置环境变量（如果需要）
4. 部署！

### 2. 后端部署

由于 Vercel Functions 有一些限制，建议将后端部署到：
- Railway
- Render
- 或者其他支持 Node.js 的云服务

部署后，修改 `vercel.json` 中的 API 代理地址。

## API 接口

### 获取所有日记
`GET /api/diaries`

### 获取单篇日记
`GET /api/diaries/:id`

### 创建日记
`POST /api/diaries`
```json
{
  "title": "日记标题",
  "content": "日记内容",
  "weather": "晴天",
  "mood": "开心"
}
```

### 更新日记
`PUT /api/diaries/:id`

### 删除日记
`DELETE /api/diaries/:id`

## 数据库表结构

`diaries` 表：
- `id`: 主键，自增
- `title`: 标题
- `content`: 内容
- `weather`: 天气
- `mood`: 心情
- `created_at`: 创建时间
- `updated_at`: 更新时间

## License

ISC
