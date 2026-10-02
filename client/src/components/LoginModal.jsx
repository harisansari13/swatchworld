import React, { useState } from 'react';
import { ShieldCheck, Lock, User, Phone, CheckCircle2, X, ArrowRight, Building2 } from 'lucide-react';
import { translations } from '../utils/translations';

export default function LoginModal({ isOpen, onClose, onLoginSuccess, lang }) {
  if (!isOpen) return null;
  const t = translations[lang] || translations.en;

  const [role, setRole] = useState('citizen');
  const [mobile, setMobile] = useState('9876543210');
  const [name, setName] = useState('Aarav Sharma');
  const [officerId, setOfficerId] = useState('OFFICER-WARD-4');
  const [password, setPassword] = useState('admin123');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (role === 'citizen') {
      onLoginSuccess({
        name: name || 'Citizen User',
        mobile,
        role: 'citizen',
        ward: 'Ward 4 - Smart City Hub'
      });
    } else {
      onLoginSuccess({
        name: 'Municipal Officer Shinde',
        officerId,
        role: 'admin',
        ward: 'Central Admin Zone'
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
      
      {/* Claymorphic Soft 3D Card */}
      <div className="clay-card w-full max-w-md p-8 relative overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-sky-100/50 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-sky-500 via-sky-600 to-cyan-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-sky-500/30 text-2xl font-black ring-4 ring-white">
            🛡️
          </div>
          <span className="text-[11px] font-extrabold tracking-widest text-sky-700 uppercase block">Official Govt Portal</span>
          <h2 className="text-2xl font-black text-slate-900">{t.portalLogin}</h2>
          <p className="text-xs text-slate-500 font-medium">
            Secure single sign-on for citizens and municipal authorities.
          </p>
        </div>

        {/* Role Toggle Selector */}
        <div className="p-1.5 bg-sky-100/80 rounded-2xl flex border border-sky-200 mb-6 shadow-inner">
          <button
            type="button"
            onClick={() => setRole('citizen')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition flex items-center justify-center space-x-1.5 ${
              role === 'citizen'
                ? 'bg-white text-sky-800 shadow-md border border-sky-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Citizen Portal</span>
          </button>
          
          <button
            type="button"
            onClick={() => setRole('admin')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition flex items-center justify-center space-x-1.5 ${
              role === 'admin'
                ? 'bg-sky-800 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Municipal Officer</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {role === 'citizen' ? (
            <>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
                <input 
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full bg-white border border-sky-200 rounded-2xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-sky-500 font-medium shadow-inner"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Mobile Number / OTP</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                  <input 
                    type="text"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full bg-white border border-sky-200 rounded-2xl pl-11 pr-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-sky-500 font-medium shadow-inner"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 text-[11px] text-sky-900 flex items-start space-x-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <span>Demo OTP automatically verified for instant portal access!</span>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Officer Department ID</label>
                <input 
                  type="text"
                  required
                  value={officerId}
                  onChange={(e) => setOfficerId(e.target.value)}
                  placeholder="e.g. OFFICER-WARD-4"
                  className="w-full bg-white border border-sky-200 rounded-2xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-sky-500 font-medium shadow-inner"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Department Password</label>
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-sky-200 rounded-2xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-sky-500 font-medium shadow-inner"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 text-[11px] text-sky-900 flex items-start space-x-2 font-medium">
                <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <span>Encrypted Municipal Admin Portal Access.</span>
              </div>
            </>
          )}

          {/* Claymorphic Action Button */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl clay-button font-extrabold text-xs shadow-lg transition flex items-center justify-center space-x-2"
          >
            <span>Login & Proceed to Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </form>

      </div>

    </div>
  );
}
