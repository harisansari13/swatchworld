import React from 'react';
import { PhoneCall, Globe, User, LogOut, Award, Lock } from 'lucide-react';
import { translations } from '../utils/translations';

export default function OfficialHeader({ lang, setLang, currentUser, onLogout, onOpenLogin, userPoints }) {
  const t = translations[lang] || translations.en;

  return (
    <div className="bg-white border-b border-sky-100 shadow-sm sticky top-0 z-50">
      
      {/* Official Government Tricolor Strip */}
      <div className="govt-tricolor-bar" />

      {/* Top Utility Bar */}
      <div className="bg-sky-900 text-sky-100 text-[11px] py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1 font-semibold">
              <span className="text-amber-400">🇮🇳</span>
              <span>{t.govtHeader}</span>
            </span>
            <span className="hidden sm:inline text-sky-300">|</span>
            <span className="hidden sm:flex items-center space-x-1 text-sky-200">
              <PhoneCall className="w-3 h-3 text-sky-400" />
              <span>{t.helpline}</span>
            </span>
          </div>

          {/* Language Switcher Dropdown in Utility Bar */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1 bg-sky-950 px-2.5 py-1 rounded-lg border border-sky-700 text-xs shadow-inner">
              <Globe className="w-3.5 h-3.5 text-sky-400" />
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="bg-transparent text-white font-bold focus:outline-none text-[11px] cursor-pointer"
              >
                <option value="en" className="bg-sky-900 text-white">English 🇺🇸</option>
                <option value="hi" className="bg-sky-900 text-white">हिंदी 🇮🇳</option>
                <option value="mr" className="bg-sky-900 text-white">मराठी 🚩</option>
              </select>
            </div>
          </div>

        </div>
      </div>

      {/* Official Branding Header Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Official Crest Logo & Title */}
        <div className="flex items-center space-x-3.5 cursor-pointer">
          
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-600 via-sky-500 to-cyan-400 p-0.5 shadow-md shadow-sky-500/20 flex items-center justify-center ring-2 ring-sky-300/50">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-sky-600 font-extrabold text-2xl">
              🛡️
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                {t.appTitle}
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-sky-100 text-sky-800 border border-sky-200">
                Official Portal
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 hidden sm:block">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Auth status or Login Button */}
        <div className="flex items-center space-x-3">
          {currentUser ? (
            <div className="flex items-center space-x-3 animate-in fade-in duration-300">
              
              <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-extrabold">
                <Award className="w-4 h-4 text-amber-500" />
                <span>{userPoints} Pts</span>
              </div>

              <div className="flex items-center space-x-2 bg-sky-50 px-3 py-1.5 rounded-xl border border-sky-200 text-xs">
                <User className="w-4 h-4 text-sky-600" />
                <span className="font-extrabold text-slate-800">{currentUser.name}</span>
                <span className="text-[10px] font-bold text-sky-700 bg-sky-100 px-1.5 py-0.5 rounded">
                  {currentUser.role === 'admin' ? 'Officer' : 'Citizen'}
                </span>
              </div>

              <button
                onClick={onLogout}
                className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 transition"
                title={t.logout}
              >
                <LogOut className="w-4 h-4" />
              </button>

            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-500 hover:to-sky-600 text-white font-extrabold text-xs shadow-md shadow-sky-600/20 transition flex items-center space-x-1.5 transform hover:scale-105 active:scale-95"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{t.portalLogin}</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
