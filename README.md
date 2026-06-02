# 地震预警系统 (Earthquake Early Warning System)

一个在线地震预警系统，能够通过微信发送地震提醒。

## 功能特性

- 🌍 **实时地震数据**: 从美国地质调查局(USGS)获取实时地震数据
- 🔔 **微信通知**: 通过 Server酱发送地震预警到微信
- ⚙️ **可配置阈值**: 自定义触发通知的最低震级
- 🎨 **现代化界面**: 基于 React + TailwindCSS 的响应式设计
- 📊 **数据可视化**: 直观展示地震信息，包括震级、位置、深度等
- 🔄 **自动刷新**: 每30秒自动更新地震数据，每5分钟检查新地震

## 技术栈

### 后端
- Node.js + Express
- Axios (HTTP 请求)
- node-cron (定时任务)
- dotenv (环境变量管理)

### 前端
- React 18
- Vite (构建工具)
- TailwindCSS (样式)
- Lucide React (图标)
- date-fns (日期处理)
- Axios (HTTP 请求)

## 项目结构

```
earthquake-warning-system/
├── client/                 # 前端应用
│   ├── src/
│   │   ├── components/     # React 组件
│   │   │   ├── EarthquakeList.jsx
│   │   │   └── ConfigPanel.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
├── server/                 # 后端服务
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── package.json            # 根目录依赖
└── README.md
```

## 安装步骤

### 1. 克隆项目

```bash
cd d:/windsruf/earth
```

### 2. 安装依赖

```bash
# 安装根目录依赖
npm install

# 安装后端依赖
cd server
npm install

# 安装前端依赖
cd ../client
npm install
```

### 3. 配置环境变量

在 `server` 目录下创建 `.env` 文件：

```bash
cd server
cp .env.example .env
```

编辑 `.env` 文件：

```env
PORT=3001
SERVERCHAN_SCKEY=your_serverchan_sckey_here
ALERT_THRESHOLD=5.0
```

### 4. 获取 Server酱 SCKEY

1. 访问 [Server酱官网](https://sct.ftqq.com/)
2. 使用微信扫码登录
3. 获取你的 SCKEY
4. 将 SCKEY 填入 `.env` 文件的 `SERVERCHAN_SCKEY` 字段

## 运行项目

### 开发模式（同时启动前后端）

```bash
# 在项目根目录
npm run dev
```

这将同时启动：
- 前端: http://localhost:3000
- 后端: http://localhost:3001

### 分别启动

```bash
# 启动后端
cd server
npm run dev

# 启动前端（新终端）
cd client
npm run dev
```

### 生产构建

```bash
# 构建前端
npm run build

# 启动后端
cd server
npm start
```

## 使用说明

### 配置预警阈值

1. 点击页面右上角的"设置"按钮
2. 在"预警阈值"部分调整滑块设置最低震级
3. 点击"保存阈值"

### 配置微信通知

1. 点击页面右上角的"设置"按钮
2. 在"微信通知"部分输入你的 Server酱 SCKEY
3. 点击"保存配置"

### 查看地震数据

- 页面会自动显示最近24小时内震级大于2.5的地震
- 点击"刷新"按钮手动更新数据
- 点击"详情"链接查看 USGS 官方详细信息

## API 接口

### 获取地震数据
```
GET /api/earthquakes
```

### 更新 Server酱配置
```
POST /api/config/serverchan
Body: { sckey: string }
```

### 更新预警阈值
```
POST /api/config/threshold
Body: { threshold: number }
```

### 获取当前配置
```
GET /api/config
```

## 数据来源

- 地震数据: [USGS (美国地质调查局)](https://earthquake.usgs.gov/)
- API 文档: [USGS Earthquake API](https://earthquake.usgs.gov/fdsnws/event/1/)

## 注意事项

⚠️ **重要声明**:
- 本系统提供的数据仅供参考，不作为官方预警依据
- 请关注当地政府和官方地震预警机构发布的信息
- 系统依赖第三方服务（USGS、Server酱），可能出现服务中断
- 建议配合其他预警手段使用

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

## 联系方式

如有问题或建议，请通过 GitHub Issues 联系。
