# 📚 小小日记 - Vercel部署教程

## 🚀 快速部署

### 前置准备

1. ✅ GitHub/GitLab 账号
2. ✅ Vercel 账号
3. ✅ Supabase 数据库（已配置好）

---

## 📋 第一步：准备项目

### 1. 初始化 Git 仓库

在项目根目录下执行：

```bash
cd c:\Users\21656\Desktop\小小日记
git init
git add .
git commit -m "Initial commit"
```

### 2. 推送到 GitHub

在 GitHub 上创建一个新仓库，然后执行：

```bash
git remote add origin <你的GitHub仓库地址>
git branch -M main
git push -u origin main
```

---

## 🔧 第二步：在 Vercel 中部署

### 1. 登录 Vercel

访问 [vercel.com](https://vercel.com)，使用 GitHub 账号登录。

### 2. 导入项目

1. 点击 Dashboard 右上角的 **Add New...** → **Project**
2. 选择刚刚推送的 GitHub 仓库
3. 点击 **Import**

### 3. 配置项目

在 **Configure Project** 页面：

**项目设置：**
- **Project Name**: 输入项目名称（如 `xiaoxiao-diary`）
- **Framework Preset**: 选择 `Other`
- **Root Directory**: 保持默认

**构建与输出设置：**
- **Build Command**: `npm run build`
- **Output Directory**: `frontend/dist`
- **Install Command**: `npm install`

### 4. 配置环境变量（重要！）

在 **Environment Variables** 部分，点击 **Add** 添加以下变量：

| 变量名 | 值 |
|--------|-----|
| `DB_HOST` | `aws-1-eu-central-1.pooler.supabase.com` |
| `DB_PORT` | `5432` |
| `DB_USER` | `postgres.zmlabeezblshtonpcjht` |
| `DB_PASSWORD` | `Lyh2165602334` |
| `DB_NAME` | `postgres` |

⚠️ **注意**：确保勾选 **Automatically expose System Environment Variables**

### 5. 开始部署

点击 **Deploy** 按钮，等待 1-3 分钟！

---

## ✅ 验证部署

部署完成后：

1. Vercel 会显示部署成功的页面
2. 访问提供的 URL（如 `https://xiaoxiao-diary.vercel.app`）
3. 测试写日记功能

---

## 🌐 项目结构（Vercel 专用）

```
小小日记/
├── api/                      # Vercel Serverless Functions
│   ├── _db.js               # 数据库连接模块
│   ├── diaries.js           # 获取/创建日记
│   └── diaries/
│       └── [id].js          # 编辑/删除日记
├── frontend/                # 前端
│   ├── index.html
│   ├── main.js
│   ├── App.vue
│   ├── style.css
│   ├── vite.config.js
│   └── package.json
├── backend/                 # 本地开发用（可选）
├── vercel.json              # Vercel 配置
├── package.json
└── .gitignore
```

---

## ⚙️ API 端点（部署后）

部署完成后，API 地址自动变成：

- `GET /api/diaries` - 获取所有日记
- `POST /api/diaries` - 创建日记
- `GET /api/diaries/[id]` - 获取单个日记
- `PUT /api/diaries/[id]` - 更新日记
- `DELETE /api/diaries/[id]` - 删除日记

---

## 🔄 重新部署

### 自动部署（推荐）

每次 push 代码到 GitHub 的 `main` 分支，Vercel 会自动重新部署！

### 手动部署

在 Vercel Dashboard 中：
1. 进入项目
2. 点击 **Deployments**
3. 选择最新的 commit
4. 点击 **Redeploy**

---

## 💡 常见问题

### Q: 数据库连接失败？

**A:** 检查 Vercel 环境变量是否正确配置，特别是 `DB_PASSWORD`。

### Q: 部署成功但 API 返回 500？

**A:** 检查 Supabase 数据库的网络访问权限是否允许所有 IP。

### Q: 如何更新环境变量？

**A:** 在 Vercel 项目 → Settings → Environment Variables，修改后需要重新部署。

### Q: 可以自定义域名吗？

**A:** 可以！在 Vercel 项目 → Settings → Domains 中添加你的域名。

---

## 📞 技术支持

- Vercel 文档: [vercel.com/docs](https://vercel.com/docs)
- Supabase 文档: [supabase.com/docs](https://supabase.com/docs)

---

## 🎉 恭喜！

你的小小日记现在已经在云端运行了！🎊

---

## 📝 本地开发与生产环境切换

### 本地开发

```bash
# 使用 backend/ 目录的传统 Express 服务器
npm run dev:backend    # 端口 3000
npm run dev:frontend   # 端口 5173
```

### 生产环境（Vercel）

- 自动使用 `/api/` 目录下的 Serverless Functions
- 前端静态文件托管
- API 自动路由
