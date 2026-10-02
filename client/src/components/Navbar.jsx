import React from 'react';
import { 
  Home,
  Camera, 
  Map, 
  LayoutDashboard, 
  Trophy, 
  Clock, 
  Sparkles,
  Lock
} from 'lucide-react';
import { translations } from '../utils/translations';

export default function Navbar({ activeTab, setActiveTab, lang, currentUser, onOpenLogin }) {
  const t = translations[lang] || translations.en;

  const allNavItems = [
    { id: 'landing', label: t.navHome, icon: Home },
    { id: 'report', label: t.navReport, icon: Camera },
    { id: 'scanner', label: t.navScanner, icon: Sparkles, badge: 'AI HUD' },
    { id: 'map', label: t.navMap, icon: Map },
    { id: 'admin', label: t.navAdmin, icon: LayoutDashboard, badge: 'Officer' },
    { id: 'leaderboard', label: t.navLeaderboard, icon: Trophy },
    { id: 'my-reports', label: t.navMyReports, icon: Clock },
  ];

  // If NOT logged in, only show Landing Page tab and Login CTA button
  const visibleNavItems = currentUser ? allNavItems : [allNavItems[0]];

  return (
    <nav className="bg-sky-900 border-b border-sky-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        
        <div className="flex items-center justify-between py-2">
          
          <div className="flex items-center space-x-1 overflow-x-auto scrollbar-none">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 transform active:scale-95 ${
                    isActive
                      ? 'bg-white text-sky-900 shadow-md ring-2 ring-sky-300'
                      : 'text-sky-100 hover:bg-sky-800 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-sky-700' : 'text-sky-300'}`} />
                  <span>{item.label}</span>
                  
                  {item.badge && (
                    <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-md ${
                      isActive ? 'bg-sky-100 text-sky-800' : 'bg-sky-950 text-sky-300'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {!currentUser && (
            <button
              onClick={onOpenLogin}
              className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs shadow-sm transition flex items-center space-x-1.5 shrink-0"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{t.portalLogin}</span>
            </button>
          )}

        </div>

      </div>
    </nav>
  );
}
