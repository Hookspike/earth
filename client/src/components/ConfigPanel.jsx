import React, { useState } from 'react';
import { X, Bell, Gauge, Save, Check, Send } from 'lucide-react';
import axios from 'axios';

function ConfigPanel({ config, onConfigUpdate, onClose }) {
  const [threshold, setThreshold] = useState(config.threshold);
  const [sckey, setSckey] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);

  const handleSaveThreshold = async () => {
    try {
      setSaving(true);
      await axios.post('/api/config/threshold', { threshold });
      setSaved(true);
      onConfigUpdate();
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Error saving threshold:', error);
      alert('保存失败');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSckey = async () => {
    try {
      setSaving(true);
      await axios.post('/api/config/serverchan', { sckey });
      setSaved(true);
      onConfigUpdate();
      setSckey('');
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Error saving SCKEY:', error);
      alert('保存失败');
    } finally {
      setSaving(false);
    }
  };

  const handleTestNotification = async () => {
    try {
      setTesting(true);
      await axios.post('/api/test-notification');
      alert('测试通知已发送！请检查微信。');
    } catch (error) {
      console.error('Error sending test notification:', error);
      alert('发送测试通知失败，请检查配置。');
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-slate-700 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">系统设置</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-slate-400" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Threshold Setting */}
        <div className="bg-slate-900/50 rounded-lg p-5 border border-slate-700">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-warning-500/20 rounded-lg">
              <Gauge className="w-5 h-5 text-warning-400" />
            </div>
            <div>
              <h3 className="font-medium text-white">预警阈值</h3>
              <p className="text-sm text-slate-400">设置触发微信通知的最低震级</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-2">
                当前阈值: {threshold} 级
              </label>
              <input
                type="range"
                min="3.0"
                max="9.0"
                step="0.5"
                value={threshold}
                onChange={(e) => setThreshold(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>3.0</span>
                <span>9.0</span>
              </div>
            </div>

            <button
              onClick={handleSaveThreshold}
              disabled={saving}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>已保存</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{saving ? '保存中...' : '保存阈值'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ServerChan Setting */}
        <div className="bg-slate-900/50 rounded-lg p-5 border border-slate-700">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Bell className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h3 className="font-medium text-white">微信通知</h3>
              <p className="text-sm text-slate-400">配置 Server酱推送服务</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-2">
                当前状态: {config.serverchanConfigured ? '已配置' : '未配置'}
              </label>
              <input
                type="text"
                value={sckey}
                onChange={(e) => setSckey(e.target.value)}
                placeholder="输入 Server酱 SCKEY"
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-primary-500"
              />
              <p className="text-xs text-slate-500 mt-2">
                获取 SCKEY: 访问{' '}
                <a
                  href="https://sct.ftqq.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-400 hover:underline"
                >
                  https://sct.ftqq.com/
                </a>
              </p>
            </div>

            <button
              onClick={handleSaveSckey}
              disabled={saving || !sckey}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>已保存</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{saving ? '保存中...' : '保存配置'}</span>
                </>
              )}
            </button>

            {config.serverchanConfigured && (
              <button
                onClick={handleTestNotification}
                disabled={testing}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{testing ? '发送中...' : '发送测试通知'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
        <h4 className="font-medium text-white mb-2">使用说明</h4>
        <ul className="text-sm text-slate-400 space-y-1">
          <li>• 系统每5分钟自动检查一次新的地震数据</li>
          <li>• 当震级超过设定阈值时，会通过微信发送通知</li>
          <li>• 数据来源于美国地质调查局(USGS)，仅供参考</li>
          <li>• 请勿将此系统作为唯一的地震预警依据</li>
        </ul>
      </div>
    </div>
  );
}

export default ConfigPanel;
