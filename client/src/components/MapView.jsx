import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, CheckCircle2 } from 'lucide-react';
import { translations } from '../utils/translations';

function createCustomIcon(status, severity) {
  let color = '#d97706'; // Amber
  let iconText = '🔴';
  
  if (status === 'Resolved') {
    color = '#16a34a'; // Emerald
    iconText = '🟢';
  } else if (status === 'In Progress') {
    color = '#0284c7'; // Sky Blue
    iconText = '🔵';
  } else if (severity === 'Critical') {
    color = '#e11d48'; // Rose
    iconText = '⚠️';
  }

  const svgHtml = `
    <div style="
      background-color: ${color};
      width: 34px;
      height: 34px;
      border-radius: 50%;
      border: 3px solid #ffffff;
      box-shadow: 0 4px 12px rgba(2, 132, 199, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      cursor: pointer;
    ">
      ${iconText}
    </div>
  `;

  return L.divIcon({
    html: svgHtml,
    className: 'custom-leaflet-marker',
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -30]
  });
}

export default function MapView({ complaints, lang }) {
  const t = translations[lang] || translations.en;

  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  const filteredMapComplaints = complaints.filter(item => {
    if (filterCategory !== 'All' && item.category !== filterCategory) return false;
    if (filterStatus !== 'All' && item.status !== filterStatus) return false;
    return true;
  });

  const defaultCenter = [18.5204, 73.8567];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      
      {/* Top Banner */}
      <div className="govt-card-sky rounded-3xl p-6 border border-sky-200 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-100 border border-sky-200 text-sky-800 text-xs font-bold mb-1">
            <MapPin className="w-3.5 h-3.5 text-sky-600" />
            <span>GIS Geospatial Map Engine</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Interactive Civic Damage Map</h1>
          <p className="text-xs text-slate-600 font-medium">
            Geospatial tracking of reported civic damages across municipal smart city wards.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-3 bg-white p-2.5 rounded-2xl border border-sky-200 shadow-sm shrink-0">
          
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-bold focus:outline-none"
          >
            <option value="All">All Categories</option>
            <option value="Pothole">Potholes</option>
            <option value="Garbage Accumulation">Garbage</option>
            <option value="Road Crack">Road Cracks</option>
            <option value="Damaged Streetlight">Streetlights</option>
            <option value="Water Leakage">Water Leakage</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-bold focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending 🔴</option>
            <option value="In Progress">In Progress 🔵</option>
            <option value="Resolved">Resolved 🟢</option>
          </select>

        </div>
      </div>

      {/* Main Map Container */}
      <div className="govt-card p-3 h-[650px] relative overflow-hidden">
        
        <MapContainer
          center={defaultCenter}
          zoom={13}
          scrollWheelZoom={true}
          style={{ width: '100%', height: '100%', borderRadius: '16px' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {filteredMapComplaints.map((item) => {
            const lat = item.location?.lat || 18.5204;
            const lng = item.location?.lng || 73.8567;
            const customMarkerIcon = createCustomIcon(item.status, item.severity);

            return (
              <Marker 
                key={item._id || item.id} 
                position={[lat, lng]} 
                icon={customMarkerIcon}
              >
                <Popup>
                  <div className="p-1 space-y-2 max-w-xs font-sans text-slate-900">
                    <div className="relative aspect-video rounded-lg overflow-hidden border border-slate-200">
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    </div>

                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900">{item.title}</h4>
                      <p className="text-[11px] text-slate-600">{item.location?.address}</p>
                    </div>

                    <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-100 font-bold">
                      <span className="text-sky-800">{item.location?.ward}</span>
                      <span className={`px-2 py-0.5 rounded ${
                        item.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' :
                        item.status === 'In Progress' ? 'bg-sky-100 text-sky-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

      </div>

    </div>
  );
}
