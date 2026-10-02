import React, { useState } from 'react';
import { 
  Sparkles, 
  Cpu, 
  Target, 
  Zap, 
  Activity
} from 'lucide-react';
import { scanImageAI } from '../utils/api';

const scannerPresets = [
  {
    title: "Severe Road Pothole",
    category: "Pothole",
    imageUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=1200&q=80",
    bbox: { x: 20, y: 30, width: 55, height: 45, label: "POTHOLE (96%)" },
    confidence: 0.96,
    severity: "Critical",
    desc: "YOLOv8 detected high depth asphalt depression endangering vehicles."
  },
  {
    title: "Urban Garbage Overflow",
    category: "Garbage Accumulation",
    imageUrl: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=1200&q=80",
    bbox: { x: 15, y: 18, width: 68, height: 60, label: "GARBAGE (94%)" },
    confidence: 0.94,
    severity: "High",
    desc: "Object detection identified bio-waste accumulation outside designated bin."
  },
  {
    title: "Damaged Streetlight Pole",
    category: "Damaged Streetlight",
    imageUrl: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=1200&q=80",
    bbox: { x: 35, y: 10, width: 30, height: 75, label: "STREETLIGHT (91%)" },
    confidence: 0.91,
    severity: "Medium",
    desc: "Fixture tilt and broken lamp housing detected in urban transit corridor."
  },
  {
    title: "Pipeline Water Leakage",
    category: "Water Leakage",
    imageUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=1200&q=80",
    bbox: { x: 25, y: 25, width: 50, height: 50, label: "WATER LEAK (95%)" },
    confidence: 0.95,
    severity: "High",
    desc: "Sub-surface main pipeline breach detected from water surface pattern analysis."
  }
];

export default function AIScanner() {
  const [activePreset, setActivePreset] = useState(scannerPresets[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [hudResult, setHudResult] = useState(scannerPresets[0]);

  const handleRunScan = async (preset) => {
    setActivePreset(preset);
    setIsScanning(true);
    const result = await scanImageAI(preset.imageUrl, preset.category);
    setTimeout(() => {
      setHudResult({
        ...preset,
        confidence: result.confidence || preset.confidence,
        severity: result.severity || preset.severity,
        bbox: result.aiBoundingBox || preset.bbox
      });
      setIsScanning(false);
    }, 700);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header */}
      <div className="govt-card-sky rounded-3xl p-6 sm:p-8 border border-sky-200 shadow-md">
        <div className="flex items-center space-x-3 text-sky-800 mb-2">
          <Cpu className="w-6 h-6 text-sky-600 animate-pulse" />
          <span className="text-xs font-mono font-bold tracking-wider uppercase">YOLOv8 Computer Vision Engine</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">Live AI Object Detection HUD</h1>
        <p className="text-sm text-slate-600 max-w-2xl font-medium mt-1">
          Explore real-time computer vision inference. The YOLOv8 model isolates damage boundaries, computes confidence percentages, and assigns severity grades.
        </p>
      </div>

      {/* Preset Selector Chips */}
      <div className="flex items-center space-x-3 overflow-x-auto pb-2">
        {scannerPresets.map((preset, index) => (
          <button
            key={index}
            onClick={() => handleRunScan(preset)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition shrink-0 flex items-center space-x-2 border ${
              activePreset.title === preset.title
                ? 'bg-sky-600 text-white border-sky-600 shadow-md shadow-sky-600/20'
                : 'bg-white text-slate-700 border-sky-200 hover:bg-sky-50'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>{preset.title}</span>
          </button>
        ))}
      </div>

      {/* HUD Scanner Main Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-8">
          <div className="govt-card p-4 relative group overflow-hidden">
            
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-md">
              <img 
                src={hudResult.imageUrl} 
                alt={hudResult.title}
                className="w-full h-full object-cover"
              />

              {isScanning && <div className="scan-line" />}

              {!isScanning && hudResult.bbox && (
                <div 
                  className="absolute border-2 border-sky-400 bg-sky-500/20 rounded transition-all duration-500 shadow-lg shadow-sky-500/30"
                  style={{
                    left: `${hudResult.bbox.x}%`,
                    top: `${hudResult.bbox.y}%`,
                    width: `${hudResult.bbox.width}%`,
                    height: `${hudResult.bbox.height}%`
                  }}
                >
                  <div className="absolute -top-7 left-0 bg-sky-600 text-white text-[11px] font-mono font-extrabold px-2.5 py-0.5 rounded shadow">
                    {hudResult.bbox.label}
                  </div>
                </div>
              )}

              <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur px-3 py-1.5 rounded-xl border border-slate-700 flex items-center space-x-2 text-xs font-mono text-sky-400">
                <Activity className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
                <span>STATE: INFERENCE_ONLINE</span>
              </div>
            </div>

          </div>
        </div>

        {/* Telemetry Panel */}
        <div className="lg:col-span-4 space-y-4">
          <div className="govt-card p-6 space-y-5">
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2 border-b border-sky-100 pb-3">
              <Zap className="w-5 h-5 text-sky-600" />
              <span>Model Telemetry</span>
            </h2>

            <div className="space-y-4">
              <div>
                <span className="text-xs text-slate-500 font-bold block mb-1">Target Classification</span>
                <p className="text-xl font-extrabold text-slate-900">{hudResult.category}</p>
                <p className="text-xs text-slate-600 mt-1 font-medium">{hudResult.desc}</p>
              </div>

              <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-bold">Confidence Score</span>
                  <span className="font-mono font-bold text-sky-700">
                    {((hudResult.confidence || 0.94) * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-sky-200 overflow-hidden">
                  <div 
                    className="h-full bg-sky-600 transition-all duration-500"
                    style={{ width: `${(hudResult.confidence || 0.94) * 100}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Severity</span>
                  <p className="text-base font-extrabold text-amber-600 mt-0.5">
                    {hudResult.severity}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Model</span>
                  <p className="text-xs font-mono font-bold text-sky-800 mt-1">YOLOv8 Small</p>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
