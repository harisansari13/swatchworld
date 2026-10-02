import React from 'react';
import { Clock, CheckCircle2, MapPin, Award } from 'lucide-react';
import { translations } from '../utils/translations';

export default function MyReports({ complaints, lang, currentUser }) {
  const t = translations[lang] || translations.en;
  const userReports = complaints.slice(0, 4);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      
      {/* Banner */}
      <div className="govt-card-sky rounded-3xl p-6 sm:p-8 border border-sky-200 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-100 border border-sky-200 text-sky-800 text-xs font-bold mb-2">
            <Clock className="w-3.5 h-3.5 text-sky-600" />
            <span>Citizen Tracking Portal</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">My Submitted Reports</h1>
          <p className="text-sm text-slate-600 mt-1 max-w-xl font-medium">
            Track reported civic issues in real-time. View repair updates and transparency proof photos uploaded by municipal officers.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-white p-3.5 rounded-2xl border border-sky-200 shadow-sm shrink-0">
          <Award className="w-8 h-8 text-amber-500" />
          <div>
            <span className="text-xs text-slate-500 font-bold uppercase">Contribution</span>
            <p className="text-lg font-extrabold text-slate-900">{userReports.length} Reports Filed</p>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-6">
        {userReports.map((item) => (
          <div 
            key={item._id || item.id}
            className="govt-card p-6 space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sky-100 pb-3">
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                  item.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                  item.status === 'In Progress' ? 'bg-sky-100 text-sky-800 border border-sky-300' :
                  'bg-amber-100 text-amber-800 border border-amber-300'
                }`}>
                  {item.status}
                </span>
                <span className="text-xs font-mono text-slate-500">ID: #{item._id || item.id}</span>
              </div>

              <span className="text-xs text-slate-500 font-medium">
                Filed on {new Date(item.createdAt || Date.now()).toLocaleDateString()}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              <div className="md:col-span-5 space-y-2">
                <span className="text-xs font-bold text-slate-600 block">Reported Issue (Before)</span>
                <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                </div>
              </div>

              {item.status === 'Resolved' && item.proofUrl && (
                <div className="md:col-span-5 space-y-2">
                  <span className="text-xs font-bold text-emerald-700 block flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Resolution Proof (After Repair)</span>
                  </span>
                  <div className="relative aspect-video rounded-2xl overflow-hidden border border-emerald-300 shadow-sm">
                    <img src={item.proofUrl} alt="Fixed" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}

              <div className={item.status === 'Resolved' && item.proofUrl ? 'md:col-span-2 space-y-3' : 'md:col-span-7 space-y-3'}>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">{item.title}</h3>
                  <p className="text-xs text-slate-600 mt-1">{item.description || "No extra context added."}</p>
                </div>

                <div className="p-3 rounded-xl bg-sky-50 border border-sky-100 text-xs space-y-1">
                  <div className="flex items-center space-x-1 text-sky-800 font-bold">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{item.location?.address}</span>
                  </div>
                  <p className="text-slate-500 font-mono text-[10px] pl-4">{item.location?.ward}</p>
                </div>

                {item.resolutionNotes && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                    <span className="font-bold text-emerald-800 block mb-0.5">Municipal Officer Note:</span>
                    <p>{item.resolutionNotes}</p>
                  </div>
                )}
              </div>

            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
