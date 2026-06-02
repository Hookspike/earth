import React from 'react';
import { MapPin, Clock, ExternalLink, AlertTriangle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

function EarthquakeList({ earthquakes, getMagnitudeColor, getMagnitudeText }) {
  const sortEarthquakes = (eqs) => {
    return [...eqs].sort((a, b) => b.properties.time - a.properties.time);
  };

  const sortedEarthquakes = sortEarthquakes(earthquakes);

  return (
    <div className="space-y-4">
      {sortedEarthquakes.map((earthquake) => {
        const props = earthquake.properties;
        const coords = earthquake.geometry.coordinates;
        const timeAgo = formatDistanceToNow(new Date(props.time), {
          addSuffix: true,
          locale: zhCN
        });

        return (
          <div
            key={props.ids}
            className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-3">
                  <div
                    className={`px-4 py-2 rounded-lg ${getMagnitudeColor(props.mag)} text-white font-bold text-xl`}
                  >
                    {props.mag.toFixed(1)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {props.place || '未知位置'}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-slate-400 mt-1">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{timeAgo}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>深度: {coords[2]?.toFixed(1)} km</span>
                      </span>
                    </div>
                  </div>
                </div>

                {props.mag >= 5.0 && (
                  <div className="flex items-center space-x-2 mt-3 px-3 py-2 bg-warning-500/10 border border-warning-500/30 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-warning-400" />
                    <span className="text-warning-400 text-sm font-medium">
                      强震预警 - 请注意安全
                    </span>
                  </div>
                )}
              </div>

              <a
                href={props.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                <span className="text-sm">详情</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        );
      })}

      {sortedEarthquakes.length === 0 && (
        <div className="text-center py-12">
          <AlertTriangle className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">暂无地震数据</p>
        </div>
      )}
    </div>
  );
}

export default EarthquakeList;
