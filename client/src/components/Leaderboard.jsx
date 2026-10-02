import React from 'react';
import { Trophy, Star, Medal } from 'lucide-react';
import { translations } from '../utils/translations';

const mockLeaderboard = [
  { rank: 1, name: "Aarav Sharma", points: 450, reportsResolved: 8, badge: "Civic Champion 🏆", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" },
  { rank: 2, name: "Sneha Kulkarni", points: 380, reportsResolved: 6, badge: "Road Savior 🛣️", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80" },
  { rank: 3, name: "Priya Patel", points: 310, reportsResolved: 5, badge: "Clean City Guardian 🌿", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80" },
  { rank: 4, name: "Rahul Deshmukh", points: 260, reportsResolved: 4, badge: "Swachh Hero 🦸", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" },
  { rank: 5, name: "Vikas Shinde", points: 200, reportsResolved: 3, badge: "Active Citizen 🌟", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" }
];

export default function Leaderboard({ lang, userPoints = 150 }) {
  const t = translations[lang] || translations.en;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="govt-card-sky rounded-3xl p-6 sm:p-8 border border-sky-200 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-200 text-amber-800 text-xs font-extrabold mb-2">
            <Trophy className="w-3.5 h-3.5 text-amber-600" />
            <span>Gamified Civic Participation</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">{t.leaderboardTitle}</h1>
          <p className="text-sm text-slate-600 mt-1 max-w-xl font-medium">
            {t.leaderboardSubtitle}
          </p>
        </div>

        <div className="flex items-center space-x-4 bg-white p-4 rounded-2xl border border-sky-200 shadow-sm shrink-0">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-600">
            <Medal className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-bold uppercase">Your Balance</span>
            <p className="text-2xl font-black text-amber-600">{userPoints} Swachh Pts</p>
          </div>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mockLeaderboard.slice(0, 3).map((winner) => (
          <div 
            key={winner.rank}
            className={`govt-card p-6 text-center space-y-4 relative ${
              winner.rank === 1 ? 'border-amber-400 bg-amber-50/30 ring-2 ring-amber-300' : ''
            }`}
          >
            <div className="relative inline-block">
              <img 
                src={winner.avatar} 
                alt={winner.name} 
                className="w-20 h-20 rounded-2xl object-cover mx-auto ring-4 ring-sky-100 shadow-md"
              />
              <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950">
                Rank #{winner.rank}
              </span>
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-slate-900">{winner.name}</h3>
              <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200 inline-block mt-1">
                {winner.badge}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
              <div className="bg-sky-50 p-2 rounded-xl border border-sky-100">
                <span className="text-slate-500 font-medium">Points</span>
                <p className="font-extrabold text-amber-600 mt-0.5">{winner.points} pts</p>
              </div>
              <div className="bg-sky-50 p-2 rounded-xl border border-sky-100">
                <span className="text-slate-500 font-medium">Repairs</span>
                <p className="font-extrabold text-emerald-700 mt-0.5">{winner.reportsResolved}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Ranks Table */}
      <div className="govt-card p-6 space-y-4">
        <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
          <Star className="w-5 h-5 text-amber-500" />
          <span>Active Citizen Rankings</span>
        </h2>

        <div className="space-y-3">
          {mockLeaderboard.map((item) => (
            <div 
              key={item.rank}
              className="flex items-center justify-between p-4 rounded-2xl bg-sky-50/60 border border-sky-100 hover:border-sky-300 transition"
            >
              <div className="flex items-center space-x-4">
                <span className="font-mono font-black text-slate-400 text-sm w-6">
                  #{item.rank}
                </span>
                <img src={item.avatar} alt={item.name} className="w-10 h-10 rounded-xl object-cover" />
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">{item.name}</h4>
                  <span className="text-[11px] text-amber-700 font-bold">{item.badge}</span>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Verified Fixed</span>
                  <p className="text-xs font-extrabold text-emerald-700">{item.reportsResolved} resolved</p>
                </div>
                <div className="bg-white px-3.5 py-1.5 rounded-xl border border-sky-200">
                  <p className="text-sm font-black text-amber-600">{item.points} pts</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
