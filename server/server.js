require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cron = require('node-cron');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const ALERT_THRESHOLD = parseFloat(process.env.ALERT_THRESHOLD) || 5.0;
const SERVERCHAN_SCKEY = process.env.SERVERCHAN_SCKEY;

app.use(cors({
  origin: ['https://earthquake-warning.vercel.app', 'http://localhost:3000', 'https://earth-gclv.onrender.com', 'https://earthquake-frontend.fly.dev'],
  credentials: true
}));
app.use(express.json());

// USGS API endpoint for real-time earthquakes
const USGS_API = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson';

// Load initial config from environment variables
let currentSckey = process.env.SERVERCHAN_SCKEY || null;
let currentThreshold = parseFloat(process.env.ALERT_THRESHOLD) || 5.0;

let lastNotifiedEarthquakes = new Set();

// Fetch earthquake data from USGS
async function fetchEarthquakes() {
  try {
    const response = await axios.get(USGS_API);
    return response.data;
  } catch (error) {
    console.error('Error fetching earthquake data:', error.message);
    return null;
  }
}

// Send WeChat notification via ServerChan
async function sendWeChatNotification(title, content) {
  if (!currentSckey) {
    console.log('ServerChan SCKEY not configured, skipping notification');
    return;
  }

  try {
    const url = `https://sctapi.ftqq.com/${currentSckey}.send`;
    const response = await axios.post(url, {
      title: title,
      desp: content
    });
    console.log('WeChat notification sent successfully');
  } catch (error) {
    if (error.response) {
      console.error('Error sending WeChat notification:', error.response.status, error.response.data);
    } else {
      console.error('Error sending WeChat notification:', error.message);
    }
  }
}

// Check for new earthquakes above threshold
async function checkEarthquakes() {
  const data = await fetchEarthquakes();
  if (!data) return;

  const recentEarthquakes = data.features.filter(feature => {
    const magnitude = feature.properties.mag;
    const time = feature.properties.time;
    const earthquakeId = feature.properties.ids;
    
    // Check if earthquake is above threshold and not already notified
    return magnitude >= currentThreshold && !lastNotifiedEarthquakes.has(earthquakeId);
  });

  for (const earthquake of recentEarthquakes) {
    const props = earthquake.properties;
    const coords = earthquake.geometry.coordinates;
    
    const title = `🚨 地震预警 - 震级 ${props.mag}`;
    const content = `
**时间**: ${new Date(props.time).toLocaleString('zh-CN')}
**震级**: ${props.mag}
**位置**: ${props.place}
**深度**: ${coords[2]} km
**详情**: ${props.url}
    `.trim();

    await sendWeChatNotification(title, content);
    lastNotifiedEarthquakes.add(props.ids);
  }
}

// API endpoint to get earthquake data
app.get('/api/earthquakes', async (req, res) => {
  const data = await fetchEarthquakes();
  if (data) {
    res.json(data);
  } else {
    res.status(500).json({ error: 'Failed to fetch earthquake data' });
  }
});

// API endpoint to update ServerChan SCKEY
app.post('/api/config/serverchan', (req, res) => {
  const { sckey } = req.body;
  if (sckey) {
    currentSckey = sckey;
    res.json({ success: true, message: 'ServerChan SCKEY updated (in-memory only)' });
  } else {
    res.status(400).json({ error: 'SCKEY is required' });
  }
});

// API endpoint to update alert threshold
app.post('/api/config/threshold', (req, res) => {
  const { threshold } = req.body;
  if (threshold && !isNaN(threshold)) {
    currentThreshold = threshold;
    res.json({ success: true, message: 'Alert threshold updated (in-memory only)' });
  } else {
    res.status(400).json({ error: 'Valid threshold is required' });
  }
});

// API endpoint to get current config
app.get('/api/config', (req, res) => {
  res.json({
    threshold: parseFloat(currentThreshold) || 5.0,
    serverchanConfigured: !!currentSckey
  });
});

// API endpoint to send test notification
app.post('/api/test-notification', async (req, res) => {
  const title = '🧪 测试通知';
  const content = `
**系统**: 地震预警系统
**状态**: 微信通知测试成功
**时间**: ${new Date().toLocaleString('zh-CN')}

如果您收到此消息，说明微信通知配置正确！
  `.trim();

  await sendWeChatNotification(title, content);
  res.json({ success: true, message: 'Test notification sent' });
});

// Check for earthquakes every 5 minutes
cron.schedule('*/5 * * * *', checkEarthquakes);

// Initial check on startup
checkEarthquakes();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Alert threshold: ${currentThreshold}`);
  console.log(`ServerChan configured: ${!!currentSckey}`);
});
