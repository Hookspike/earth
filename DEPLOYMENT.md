# 部署指南

本项目可以免费部署到多个平台。以下是推荐的部署方案：

## 方案一：Vercel（推荐 - 全免费）

Vercel 可以同时部署前端和后端，完全免费。

### 前端部署到 Vercel

1. 访问 [Vercel](https://vercel.com) 并注册/登录
2. 点击 "New Project"
3. 导入 GitHub 仓库 `https://github.com/Hookspike/earth.git`
4. 配置构建设置：
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. 点击 "Deploy"

### 后端部署到 Vercel Serverless Functions

1. 在 Vercel 项目设置中添加环境变量：
   - `SERVERCHAN_SCKEY`: 你的 Server酱 SCKEY
   - `ALERT_THRESHOLD`: `5.0`
2. 修改 `vercel.json` 配置（已包含在项目中）
3. Vercel 会自动将 `/api/*` 路由到后端

### 注意事项

- Vercel Serverless Functions 有执行时间限制（10秒免费版）
- 定时任务需要使用 Vercel Cron Jobs（需要付费）
- 建议使用外部服务（如 cron-job.org）来触发定时任务

## 方案二：Render（免费后端 + Vercel 前端）

Render 提供免费的 Web 服务，适合部署 Node.js 后端。

### 后端部署到 Render

1. 访问 [Render](https://render.com) 并注册/登录
2. 点击 "New +" -> "Web Service"
3. 连接 GitHub 仓库
4. 配置：
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Environment Variables**:
     - `PORT`: `10000`（Render 自动分配）
     - `SERVERCHAN_SCKEY`: 你的 SCKEY
     - `ALERT_THRESHOLD`: `5.0`
5. 点击 "Deploy Web Service"

### 前端部署到 Vercel

同方案一的前端部署步骤。

### 配置 CORS

在 `server/server.js` 中更新 CORS 配置以允许 Render 后端域名：

```javascript
app.use(cors({
  origin: ['https://your-frontend.vercel.app', 'http://localhost:3000']
}));
```

## 方案三：Railway（免费后端 + Vercel 前端）

Railway 提供免费的 Web 服务，支持定时任务。

### 后端部署到 Railway

1. 访问 [Railway](https://railway.app) 并注册/登录
2. 点击 "New Project" -> "Deploy from GitHub repo"
3. 选择仓库
4. 配置环境变量：
   - `SERVERCHAN_SCKEY`
   - `ALERT_THRESHOLD`
5. Railway 会自动检测 Node.js 项目并部署

### 前端部署到 Vercel

同方案一的前端部署步骤。

## 方案四：GitHub Pages（仅前端） + 外部后端

如果只需要前端展示，可以使用 GitHub Pages。

### 前端部署到 GitHub Pages

1. 在 GitHub 仓库设置中启用 GitHub Pages
2. 选择 `client/dist` 作为发布源
3. 构建前端：
   ```bash
   cd client
   npm run build
   ```
4. 提交并推送

### 后端部署

使用 Render 或 Railway 部署后端。

## 环境变量配置

无论使用哪个平台，都需要配置以下环境变量：

- `SERVERCHAN_SCKEY`: Server酱的 SCKEY（必须）
- `ALERT_THRESHOLD`: 预警阈值，默认 5.0
- `PORT`: 服务器端口（某些平台自动设置）

## 定时任务说明

由于 Vercel Serverless Functions 不支持内置定时任务，建议：

1. 使用 [cron-job.org](https://cron-job.org) 免费服务
2. 或者使用 [EasyCron](https://www.easycron.com)
3. 配置定时请求你的后端 API 来触发地震检查

## 部署后配置

部署完成后，需要在前端代码中更新 API 地址：

在 `client/vite.config.js` 中：

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://your-backend-url.com',
        changeOrigin: true
      }
    }
  }
})
```

生产环境构建时，使用环境变量：

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
```

## 推荐方案

**最佳免费方案**: Vercel 前端 + Render 后端

- 前端：Vercel（无限流量，全球 CDN）
- 后端：Render（免费 Web 服务，支持定时任务）
- 成本：完全免费
- 稳定性：高

## 故障排查

1. **CORS 错误**: 确保后端 CORS 配置包含前端域名
2. **环境变量未加载**: 检查平台的环境变量设置
3. **定时任务不执行**: Render 免费版会休眠，需要使用外部 cron 服务
4. **API 请求失败**: 检查前后端 API 地址配置
