import React, { useState, useEffect } from 'react';
import { AlertTriangle, Activity, Settings, Bell, MapPin, Clock, Gauge } from 'lucide-react';
import EarthquakeList from './components/EarthquakeList';
import ConfigPanel from './components/ConfigPanel';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://earth-golv.onrender.com';

function App() {
  const [earthquakes, setEarthquakes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfig, setShowConfig] = useState(false);
  const [config, setConfig] = useState({ threshold: 5.0, serverchanConfigured: false });
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchEarthquakes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/earthquakes`);
      setEarthquakes(response.data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError('获取地震数据失败');
      console.error('Error fetching earthquakes:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchConfig = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/config`);
      setConfig(response.data);
    } catch (err) {
      console.error('Error fetching config:', err);
    }
  };

  useEffect(() => {
    fetchEarthquakes();
    fetchConfig();

    // Refresh data every 30 seconds
    const interval = setInterval(fetchEarthquakes, 30000);
    return () => clearInterval(interval);
  }, []);

  const getMagnitudeColor = (mag) => {
    if (mag >= 7.0) return 'bg-danger-500';
    if (mag >= 6.0) return 'bg-danger-400';
    if (mag >= 5.0) return 'bg-warning-500';
    if (mag >= 4.0) return 'bg-warning-400';
    return 'bg-primary-500';
  };

  const getMagnitudeText = (mag) => {
    if (mag >= 7.0) return 'text-danger-500';
    if (mag >= 6.0) return 'text-danger-400';
    if (mag >= 5.0) return 'text-warning-500';
    if (mag >= 4.0) return 'text-warning-400';
    return 'text-primary-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-900/50 backdrop-blur-lg border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-danger-500 to-danger-600 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">地震预警系统</h1>
                <p className="text-sm text-slate-400">Earthquake Early Warning System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchEarthquakes}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                <Activity className="w-4 h-4" />
                <span>刷新</span>
              </button>
              <button
                onClick={() => setShowConfig(!showConfig)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  showConfig ? 'bg-primary-600' : 'bg-slate-700 hover:bg-slate-600'
                } text-white`}
              >
                <Settings className="w-4 h-4" />
                <span>设置</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">总地震数</p>
                <p className="text-3xl font-bold text-white mt-1">
                  {earthquakes?.features?.length || 0}
                </p>
              </div>
              <div className="p-3 bg-primary-500/20 rounded-lg">
                <Activity className="w-6 h-6 text-primary-400" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">预警阈值</p>
                <p className="text-3xl font-bold text-white mt-1">
                  {config.threshold}级
                </p>
              </div>
              <div className="p-3 bg-warning-500/20 rounded-lg">
                <Gauge className="w-6 h-6 text-warning-400" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">微信通知</p>
                <p className="text-lg font-bold mt-1">
                  {config.serverchanConfigured ? (
                    <span className="text-green-400">已配置</span>
                  ) : (
                    <span className="text-slate-400">未配置</span>
                  )}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${
                config.serverchanConfigured ? 'bg-green-500/20' : 'bg-slate-700'
              }`}>
                <Bell className={`w-6 h-6 ${
                  config.serverchanConfigured ? 'text-green-400' : 'text-slate-400'
                }`} />
              </div>
            </div>
          </div>
        </div>

        {/* Config Panel */}
        {showConfig && (
          <ConfigPanel
            config={config}
            onConfigUpdate={fetchConfig}
            onClose={() => setShowConfig(false)}
          />
        )}

        {/* Loading State */}
        {loading && !earthquakes && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-danger-500/10 border border-danger-500/50 rounded-xl p-6 mb-8">
            <p className="text-danger-400">{error}</p>
          </div>
        )}

        {/* Earthquake List */}
        {earthquakes && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">最近地震</h2>
              {lastUpdated && (
                <p className="text-sm text-slate-400">
                  最后更新: {lastUpdated.toLocaleTimeString('zh-CN')}
                </p>
              )}
            </div>
            <EarthquakeList
              earthquakes={earthquakes.features}
              getMagnitudeColor={getMagnitudeColor}
              getMagnitudeText={getMagnitudeText}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900/50 border-t border-slate-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-slate-400 text-sm">
            数据来源: USGS (美国地质调查局) | 仅供参考，不作为官方预警依据
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
