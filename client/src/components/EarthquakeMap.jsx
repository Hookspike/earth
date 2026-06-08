import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function EarthquakeMap({ earthquakes }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !earthquakes) return null;

  const getMarkerColor = (magnitude) => {
    if (magnitude >= 6) return '#ef4444'; // red
    if (magnitude >= 5) return '#f97316'; // orange
    if (magnitude >= 4) return '#eab308'; // yellow
    return '#22c55e'; // green
  };

  const getMarkerRadius = (magnitude) => {
    return Math.max(5, magnitude * 3);
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-slate-700 mb-8">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
        <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
        全球地震分布图
      </h2>
      <div className="h-96 rounded-lg overflow-hidden border border-slate-600">
        <MapContainer
          center={[20, 0]}
          zoom={2}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            maxZoom={19}
          />
          {earthquakes.features.map((earthquake) => {
            const [longitude, latitude] = earthquake.geometry.coordinates;
            const magnitude = earthquake.properties.mag;
            const place = earthquake.properties.place;
            const time = new Date(earthquake.properties.time);
            
            return (
              <CircleMarker
                key={earthquake.id}
                center={[latitude, longitude]}
                radius={getMarkerRadius(magnitude)}
                fillColor={getMarkerColor(magnitude)}
                color={getMarkerColor(magnitude)}
                weight={2}
                opacity={0.8}
                fillOpacity={0.4}
                className="earthquake-marker"
              >
                <Popup>
                  <div className="text-sm">
                    <div className="font-bold">M {magnitude.toFixed(1)}</div>
                    <div>{place}</div>
                    <div className="text-gray-500">{time.toLocaleString('zh-CN')}</div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>
      <div className="mt-4 flex items-center justify-center space-x-6 text-sm text-gray-400">
        <div className="flex items-center">
          <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
          M ≥ 6.0
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 bg-orange-500 rounded-full mr-2"></span>
          M ≥ 5.0
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
          M ≥ 4.0
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
          M &lt; 4.0
        </div>
      </div>
    </div>
  );
}

export default EarthquakeMap;
