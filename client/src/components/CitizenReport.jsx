import React, { useState } from 'react';
import { 
  Camera, 
  MapPin, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  Award, 
  RefreshCw,
  ShieldAlert,
  Info
} from 'lucide-react';
import { translations } from '../utils/translations';
import { scanImageAI, submitComplaint } from '../utils/api';

const sampleImages = [
  {
    name: "Pothole Damage",
    url: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    categoryHint: "Pothole"
  },
  {
    name: "Garbage Pile",
    url: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80",
    categoryHint: "Garbage Accumulation"
  },
  {
    name: "Streetlight Issue",
    url: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80",
    categoryHint: "Damaged Streetlight"
  },
  {
    name: "Water Leakage",
    url: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80",
    categoryHint: "Water Leakage"
  }
];

export default function CitizenReport({ lang, onReportSubmitted, currentUser }) {
  const t = translations[lang] || translations.en;

  const [selectedImage, setSelectedImage] = useState(sampleImages[0].url);
  const [category, setCategory] = useState("Pothole");
  const [description, setDescription] = useState("");
  const [reporterName, setReporterName] = useState(currentUser?.name || "Aarav Sharma");
  const [reporterPhone, setReporterPhone] = useState(currentUser?.mobile || "9876543210");
  
  // GPS Location State
  const [location, setLocation] = useState({
    lat: 18.5204,
    lng: 73.8567,
    address: "FC Road, Near Deccan Gymkhana, Pune",
    ward: "Ward 4 - Smart City Hub"
  });
  const [fetchingGPS, setFetchingGPS] = useState(false);

  // AI Scanning State
  const [isScanning, setIsScanning] = useState(false);
  const [aiResult, setAiResult] = useState({
    confidence: 0.94,
    severity: "High",
    aiBoundingBox: { x: 20, y: 25, width: 60, height: 50, label: "POTHOLE (94%)" },
    processingTimeMs: 1120,
    modelName: "YOLOv8s-SwachhCheck-v1.4"
  });

  // Result Banner State
  const [submitResult, setSubmitResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Auto trigger AI scan on image/category change
  const handleScanImage = async (imageUrl, catHint) => {
    setSelectedImage(imageUrl);
    setIsScanning(true);
    const result = await scanImageAI(imageUrl, catHint || category);
    setTimeout(() => {
      setAiResult(result);
      if (result.category) setCategory(result.category);
      setIsScanning(false);
    }, 600);
  };

  const fetchLiveGPS = () => {
    setFetchingGPS(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            address: `Lat: ${pos.coords.latitude.toFixed(4)}, Lng: ${pos.coords.longitude.toFixed(4)} (GPS Verified)`,
            ward: "Ward 4 - Smart City Hub"
          });
          setFetchingGPS(false);
        },
        () => {
          setLocation({
            lat: 18.5204 + (Math.random() - 0.5) * 0.01,
            lng: 73.8567 + (Math.random() - 0.5) * 0.01,
            address: "FC Road, Near Deccan Gymkhana, Pune",
            ward: "Ward 4 - Smart City Hub"
          });
          setFetchingGPS(false);
        }
      );
    } else {
      setFetchingGPS(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        handleScanImage(evt.target.result, category);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitResult(null);

    const payload = {
      title: `${category} reported near ${location.address.split(',')[0]}`,
      description,
      category,
      severity: aiResult.severity || 'Medium',
      confidence: aiResult.confidence || 0.94,
      location,
      imageUrl: selectedImage,
      reporterName,
      reporterPhone,
      aiBoundingBox: aiResult.aiBoundingBox
    };

    const res = await submitComplaint(payload);
    setSubmitting(false);

    if (res && res.success) {
      setSubmitResult(res);
      if (onReportSubmitted) onReportSubmitted(res.complaint, res.isDuplicate);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="govt-card-sky rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-sky-200 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-100 border border-sky-200 text-sky-800 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>Official SwachhCheck Geotagged Reporting Portal</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {t.reportTitle} (नागरिक शिकायत दर्ज करें)
            </h1>
            <p className="text-sm text-slate-600 max-w-2xl font-medium">
              {t.reportSubtitle}
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-white p-4 rounded-2xl border border-sky-200 shadow-sm shrink-0">
            <Award className="w-9 h-9 text-amber-500 shrink-0" />
            <div>
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Citizen Reward</span>
              <p className="text-sm font-extrabold text-sky-700">+50 Swachh Points 🌟</p>
            </div>
          </div>
        </div>
      </div>

      {/* Submission Success / Anti-Spam Banner */}
      {submitResult && (
        <div className={`p-6 rounded-2xl border transition-all duration-300 ${
          submitResult.isDuplicate 
            ? 'bg-amber-50 border-amber-300 text-amber-900' 
            : 'bg-emerald-50 border-emerald-300 text-emerald-900'
        }`}>
          <div className="flex items-start space-x-4">
            {submitResult.isDuplicate ? (
              <ShieldAlert className="w-8 h-8 text-amber-600 shrink-0 mt-1" />
            ) : (
              <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0 mt-1" />
            )}
            <div className="space-y-2">
              <h3 className="text-lg font-bold">
                {submitResult.isDuplicate ? t.duplicateAlertTitle : "Complaint Registered Successfully! 🎉"}
              </h3>
              <p className="text-sm">
                {submitResult.isDuplicate 
                  ? submitResult.message || t.duplicateAlertText
                  : `Ticket ID #${submitResult.complaint._id || submitResult.complaint.id} dispatched to Municipal Ward Officers. You earned +50 Swachh Points!`}
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setSubmitResult(null)}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-xs font-bold text-slate-800 border border-slate-300 shadow-sm"
                >
                  Report Another Issue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Left AI Scanner HUD | Right Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: AI Vision Frame */}
        <div className="lg:col-span-6 space-y-6">
          <div className="govt-card p-6 space-y-4">
            
            <div className="flex items-center justify-between border-b border-sky-100 pb-3">
              <div className="flex items-center space-x-2">
                <Camera className="w-5 h-5 text-sky-600" />
                <h2 className="text-lg font-extrabold text-slate-900">AI Vision Image Scan</h2>
              </div>
              <span className="text-xs font-bold text-sky-700 bg-sky-100 px-2.5 py-1 rounded-md border border-sky-200">
                YOLOv8 Active
              </span>
            </div>

            {/* AI Image Frame with Overlay */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-md">
              <img 
                src={selectedImage} 
                alt="Civic Issue" 
                className="w-full h-full object-cover"
              />

              {isScanning && <div className="scan-line" />}

              {!isScanning && aiResult && aiResult.aiBoundingBox && (
                <div 
                  className="absolute border-2 border-sky-400 bg-sky-500/20 rounded transition-all duration-500 shadow-lg shadow-sky-500/30"
                  style={{
                    left: `${aiResult.aiBoundingBox.x}%`,
                    top: `${aiResult.aiBoundingBox.y}%`,
                    width: `${aiResult.aiBoundingBox.width}%`,
                    height: `${aiResult.aiBoundingBox.height}%`
                  }}
                >
                  <div className="absolute -top-6 left-0 bg-sky-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded shadow">
                    {aiResult.aiBoundingBox.label}
                  </div>
                </div>
              )}

              <label className="absolute bottom-3 right-3 bg-white/95 hover:bg-white text-slate-900 text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-200 cursor-pointer flex items-center space-x-2 shadow-lg backdrop-blur">
                <Upload className="w-4 h-4 text-sky-600" />
                <span>Upload Custom Photo</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileUpload} 
                  className="hidden" 
                />
              </label>
            </div>

            {/* Telemetry Bar */}
            <div className="grid grid-cols-3 gap-3 p-3 rounded-2xl bg-sky-50 border border-sky-100 text-center">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold">AI Confidence</span>
                <p className="text-base font-extrabold text-sky-700">
                  {((aiResult.confidence || 0.94) * 100).toFixed(0)}%
                </p>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold">Severity Grade</span>
                <p className="text-base font-extrabold text-amber-600">
                  {aiResult.severity || 'High'}
                </p>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold">Inference Time</span>
                <p className="text-base font-extrabold text-slate-700">
                  {aiResult.processingTimeMs || 1100}ms
                </p>
              </div>
            </div>

            {/* Sample Image Presets */}
            <div className="space-y-2 pt-2">
              <span className="text-xs text-slate-600 font-bold">Select Preset Damage Photo:</span>
              <div className="grid grid-cols-4 gap-2">
                {sampleImages.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleScanImage(sample.url, sample.categoryHint)}
                    className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all ${
                      selectedImage === sample.url ? 'border-sky-600 ring-2 ring-sky-300' : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={sample.url} alt={sample.name} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Geotagging & Form */}
        <div className="lg:col-span-6">
          <form onSubmit={handleSubmit} className="govt-card p-6 space-y-6">
            
            <div className="flex items-center justify-between border-b border-sky-100 pb-3">
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-sky-600" />
                <span>Geotagging & Incident Details</span>
              </h2>
              <span className="text-xs text-slate-500 font-semibold">Step 2 of 2</span>
            </div>

            {/* GPS Location Card */}
            <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-sky-900 uppercase">
                  {t.gpsLocation}
                </span>
                <button
                  type="button"
                  onClick={fetchLiveGPS}
                  disabled={fetchingGPS}
                  className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-white hover:bg-sky-100 text-sky-700 border border-sky-300 text-xs font-bold transition shadow-sm"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${fetchingGPS ? 'animate-spin' : ''}`} />
                  <span>{t.detectLocation}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-2.5 rounded-xl border border-sky-200">
                  <span className="text-slate-500 font-medium">Latitude</span>
                  <p className="font-mono font-bold text-sky-700 text-sm">{location.lat.toFixed(4)}° N</p>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-sky-200">
                  <span className="text-slate-500 font-medium">Longitude</span>
                  <p className="font-mono font-bold text-sky-700 text-sm">{location.lng.toFixed(4)}° E</p>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-600 font-bold">{t.addressLabel}</label>
                <input 
                  type="text"
                  value={location.address}
                  onChange={(e) => setLocation({ ...location, address: e.target.value })}
                  className="w-full bg-white border border-sky-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-sky-500 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-600 font-bold">{t.wardLabel}</label>
                <select
                  value={location.ward}
                  onChange={(e) => setLocation({ ...location, ward: e.target.value })}
                  className="w-full bg-white border border-sky-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-sky-500 font-medium"
                >
                  <option value="Ward 1 - North Sector">Ward 1 - North Sector</option>
                  <option value="Ward 2 - Market Central">Ward 2 - Market Central</option>
                  <option value="Ward 3 - Civic Admin Zone">Ward 3 - Civic Admin Zone</option>
                  <option value="Ward 4 - Smart City Hub">Ward 4 - Smart City Hub</option>
                </select>
              </div>
            </div>

            {/* Category & Details */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Issue Category (AI Detection)
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-sky-500 font-bold"
                >
                  <option value="Pothole">Pothole (खड्डा)</option>
                  <option value="Garbage Accumulation">Garbage Accumulation (कचरा)</option>
                  <option value="Road Crack">Road Crack (दरार)</option>
                  <option value="Damaged Streetlight">Damaged Streetlight (पथदिवा)</option>
                  <option value="Water Leakage">Water Leakage (पाणी गळती)</option>
                  <option value="General Damage">General Damage (इतर)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {t.descriptionLabel}
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add landmark or extra context..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-sky-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-600 font-bold">Reporter Name</label>
                  <input
                    type="text"
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-600 font-bold">Contact Phone</label>
                  <input
                    type="text"
                    value={reporterPhone}
                    onChange={(e) => setReporterPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-sky-600 via-sky-700 to-cyan-600 hover:from-sky-500 hover:to-cyan-600 text-white font-extrabold text-sm shadow-lg shadow-sky-600/20 transition flex items-center justify-center space-x-2"
            >
              {submitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Registering Complaint...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 text-white" />
                  <span>Submit Geotagged Complaint</span>
                </>
              )}
            </button>

          </form>
        </div>

      </div>

    </div>
  );
}
