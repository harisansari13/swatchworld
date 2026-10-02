import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Search, 
  Edit3, 
  ShieldCheck, 
  MapPin, 
  Users, 
  BarChart3,
  X
} from 'lucide-react';
import { translations } from '../utils/translations';
import { updateComplaintStatus } from '../utils/api';

const sampleProofImages = [
  "https://images.unsplash.com/photo-1528323273322-d81458248d40?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80"
];

export default function AdminDashboard({ complaints, setComplaints, lang }) {
  const t = translations[lang] || translations.en;

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedSeverity, setSelectedSeverity] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [activeComplaint, setActiveComplaint] = useState(null);
  const [newStatus, setNewStatus] = useState("Pending");
  const [proofUrl, setProofUrl] = useState(sampleProofImages[0]);
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [updating, setUpdating] = useState(false);

  // Compute Metrics
  const totalCount = complaints.length;
  const pendingCount = complaints.filter(c => c.status === 'Pending').length;
  const inProgressCount = complaints.filter(c => c.status === 'In Progress').length;
  const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;
  const resolutionRate = totalCount > 0 ? ((resolvedCount / totalCount) * 100).toFixed(1) : "0.0";

  // Filter complaints
  const filteredComplaints = complaints.filter(item => {
    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
    if (selectedStatus !== 'All' && item.status !== selectedStatus) return false;
    if (selectedSeverity !== 'All' && item.severity !== selectedSeverity) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (item.title || '').toLowerCase().includes(q);
      const matchAddress = (item.location?.address || '').toLowerCase().includes(q);
      if (!matchTitle && !matchAddress) return false;
    }
    return true;
  });

  const handleOpenModal = (item) => {
    setActiveComplaint(item);
    setNewStatus(item.status);
    setProofUrl(item.proofUrl || sampleProofImages[0]);
    setResolutionNotes(item.resolutionNotes || "");
  };

  const handleSaveStatus = async (e) => {
    e.preventDefault();
    if (!activeComplaint) return;
    setUpdating(true);

    const updated = await updateComplaintStatus(
      activeComplaint._id || activeComplaint.id,
      newStatus,
      newStatus === 'Resolved' ? proofUrl : null,
      resolutionNotes
    );

    if (updated) {
      setComplaints(prev => prev.map(c => 
        (c._id === updated._id || c.id === updated.id) ? updated : c
      ));
    } else {
      setComplaints(prev => prev.map(c => {
        if ((c._id || c.id) === (activeComplaint._id || activeComplaint.id)) {
          return {
            ...c,
            status: newStatus,
            proofUrl: newStatus === 'Resolved' ? proofUrl : null,
            resolutionNotes
          };
        }
        return c;
      }));
    }

    setUpdating(false);
    setActiveComplaint(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="govt-card-sky rounded-3xl p-6 sm:p-8 border border-sky-200 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-100 border border-sky-200 text-sky-800 text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
            <span>Municipal Authority Officer Command Center</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">{t.adminTitle}</h1>
          <p className="text-sm text-slate-600 mt-1 font-medium">
            Centralized government portal for civic damage tickets, field crew maintenance dispatch, and resolution proof verification.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-white p-4 rounded-2xl border border-sky-200 shadow-sm shrink-0">
          <BarChart3 className="w-8 h-8 text-sky-600" />
          <div>
            <span className="text-xs text-slate-500 font-bold uppercase">{t.resolutionRate}</span>
            <p className="text-xl font-black text-sky-700">{resolutionRate}%</p>
          </div>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        
        <div className="govt-card p-4">
          <span className="text-xs text-slate-500 font-bold">{t.totalComplaints}</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{totalCount}</p>
          <span className="text-[10px] text-slate-500 font-medium">Geotagged Tickets</span>
        </div>

        <div className="govt-card p-4">
          <span className="text-xs text-amber-600 font-bold flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{t.pending}</span>
          </span>
          <p className="text-2xl font-black text-amber-600 mt-1">{pendingCount}</p>
          <span className="text-[10px] text-slate-500 font-medium">Awaiting Crew</span>
        </div>

        <div className="govt-card p-4">
          <span className="text-xs text-sky-600 font-bold flex items-center space-x-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{t.inProgress}</span>
          </span>
          <p className="text-2xl font-black text-sky-600 mt-1">{inProgressCount}</p>
          <span className="text-[10px] text-slate-500 font-medium">Crew Deployed</span>
        </div>

        <div className="govt-card p-4">
          <span className="text-xs text-emerald-600 font-bold flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{t.resolved}</span>
          </span>
          <p className="text-2xl font-black text-emerald-600 mt-1">{resolvedCount}</p>
          <span className="text-[10px] text-slate-500 font-medium">Verified Fixed</span>
        </div>

        <div className="govt-card p-4 col-span-2 lg:col-span-1">
          <span className="text-xs text-sky-800 font-bold">{t.aiAccuracy}</span>
          <p className="text-2xl font-black text-sky-800 mt-1">94.6%</p>
          <span className="text-[10px] text-slate-500 font-medium">YOLOv8 Precision</span>
        </div>

      </div>

      {/* Toolbar */}
      <div className="govt-card p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search address or title..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-sky-500 font-medium"
          />
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto overflow-x-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:outline-none"
          >
            <option value="All">All Categories</option>
            <option value="Pothole">Potholes</option>
            <option value="Garbage Accumulation">Garbage</option>
            <option value="Road Crack">Road Cracks</option>
            <option value="Damaged Streetlight">Streetlights</option>
            <option value="Water Leakage">Water Leakage</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>

          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:outline-none"
          >
            <option value="All">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

      </div>

      {/* Complaints Table */}
      <div className="govt-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-800">
            <thead className="bg-sky-50 text-sky-900 font-extrabold border-b border-sky-100 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3.5">Ticket & Photo</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">GPS Location</th>
                <th className="px-4 py-3.5">Severity</th>
                <th className="px-4 py-3.5">Reports</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500 font-medium">
                    No tickets match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredComplaints.map((item) => (
                  <tr key={item._id || item.id} className="hover:bg-sky-50/50 transition">
                    
                    <td className="px-4 py-3.5">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={item.imageUrl} 
                          alt={item.title} 
                          className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0 shadow-sm" 
                        />
                        <div>
                          <p className="font-extrabold text-slate-900 max-w-xs truncate">{item.title}</p>
                          <span className="text-[10px] text-slate-500 font-mono">
                            ID: #{item._id || item.id}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 font-bold text-slate-800">
                      {item.category}
                    </td>

                    <td className="px-4 py-3.5 max-w-xs">
                      <div className="flex items-start space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="truncate text-slate-800 font-medium">{item.location?.address}</p>
                          <span className="text-[10px] text-slate-500 font-mono">{item.location?.ward}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${
                        item.severity === 'Critical' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                        item.severity === 'High' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-sky-50 text-sky-700 border-sky-200'
                      }`}>
                        {item.severity}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center space-x-1 bg-sky-50 px-2 py-1 rounded-lg border border-sky-200 text-sky-900 font-extrabold">
                        <Users className="w-3 h-3 text-sky-600" />
                        <span>{item.reportsCount || 1}</span>
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                        item.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                        item.status === 'In Progress' ? 'bg-sky-100 text-sky-800 border border-sky-300' :
                        'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}>
                        {item.status}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => handleOpenModal(item)}
                        className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-xs font-bold text-white shadow-sm flex items-center space-x-1 ml-auto"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Update Ticket</span>
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Status Modal */}
      {activeComplaint && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 border border-sky-100 space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            
            <div className="flex items-center justify-between border-b border-sky-100 pb-3">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Update Ticket Resolution</h3>
                <p className="text-xs text-slate-500 font-mono">ID: #{activeComplaint._id || activeComplaint.id}</p>
              </div>
              <button 
                onClick={() => setActiveComplaint(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStatus} className="space-y-4">
              
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Workflow Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-extrabold focus:outline-none focus:border-sky-500"
                >
                  <option value="Pending">Pending (Awaiting Maintenance)</option>
                  <option value="In Progress">In Progress (Field Team Assigned)</option>
                  <option value="Resolved">Resolved (Work Completed & Verified)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Resolution Notes / Action Taken</label>
                <textarea
                  rows={2}
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="e.g., Road repair crew deployed. Hot-mix asphalt applied..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-sky-500 font-medium"
                />
              </div>

              {newStatus === 'Resolved' && (
                <div className="space-y-2 p-3.5 rounded-2xl bg-sky-50 border border-sky-200">
                  <span className="text-xs font-bold text-sky-800 flex items-center space-x-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Upload Resolution Proof Photo (After Repair)</span>
                  </span>
                  
                  <div className="grid grid-cols-3 gap-2">
                    {sampleProofImages.map((imgUrl, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setProofUrl(imgUrl)}
                        className={`relative aspect-video rounded-xl overflow-hidden border-2 ${
                          proofUrl === imgUrl ? 'border-sky-600 ring-2 ring-sky-300' : 'border-slate-200 opacity-60'
                        }`}
                      >
                        <img src={imgUrl} alt="Proof" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveComplaint(null)}
                  className="w-1/2 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 border border-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="w-1/2 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs shadow-md shadow-sky-600/20"
                >
                  {updating ? "Saving..." : t.saveChanges}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
