import React, { useState } from 'react';
import { 
  Home,
  Camera, 
  Map, 
  LayoutDashboard, 
  Trophy, 
  Clock, 
  Sparkles,
  ChevronRight,
  ChevronLeft,
  ShieldCheck
} from 'lucide-react';
import { translations } from '../utils/translations';

export default function SidebarNav({ activeTab, setActiveTab, lang, currentUser }) {
  const t = translations[lang] || translations.en;
  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  const isExpanded = isHovered || isPinned;

  const navItems = [
    { id: 'landing', label: t.navHome, icon: Home },
    { id: 'report', label: t.navReport, icon: Camera },
    { id: 'scanner', label: t.navScanner, icon: Sparkles, badge: 'AI' },
    { id: 'map', label: t.navMap, icon: Map },
    { id: 'admin', label: t.navAdmin, icon: LayoutDashboard, badge: 'Officer' },
    { id: 'leaderboard', label: t.navLeaderboard, icon: Trophy },
    { id: 'my-reports', label: t.navMyReports, icon: Clock },
  ];

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed left-0 top-28 bottom-0 z-40 bg-white border-r border-sky-200 shadow-xl transition-all duration-300 ease-in-out flex flex-col ${
        isExpanded ? 'w-64' : 'w-16'
      }`}
    >
      
      {/* Toggle Pin Header */}
      <div className="p-3 border-b border-sky-100 flex items-center justify-between">
        <div className={`flex items-center space-x-2 transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
          <ShieldCheck className="w-5 h-5 text-sky-600 shrink-0" />
          <span className="font-extrabold text-xs text-slate-900 truncate">Navigation Menu</span>
        </div>

        <button
          onClick={() => setIsPinned(!isPinned)}
          className="p-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 transition mx-auto"
          title={isPinned ? "Unpin Sidebar" : "Pin Sidebar"}
        >
          {isExpanded ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links List */}
      <div className="flex-1 py-4 px-2 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-3 rounded-2xl text-xs font-bold transition duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-sky-600 to-sky-700 text-white shadow-md shadow-sky-600/25 ring-2 ring-sky-300'
                  : 'text-slate-600 hover:bg-sky-50 hover:text-sky-800'
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-sky-600'}`} />
              
              <span className={`truncate transition-all duration-200 ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}`}>
                {item.label}
              </span>

              {item.badge && isExpanded && (
                <span className={`ml-auto text-[9px] font-black px-1.5 py-0.5 rounded-md ${
                  isActive ? 'bg-white/20 text-white' : 'bg-sky-100 text-sky-800'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer hint */}
      {isExpanded && (
        <div className="p-3 border-t border-sky-100 text-[10px] text-slate-400 font-medium text-center">
          SwachhCheck Sidebar v1.4
        </div>
      )}

    </aside>
  );
}
