import React from 'react';
import { 
  Camera, 
  Sparkles, 
  MapPin, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  ChevronRight,
  Zap,
  Check
} from 'lucide-react';
import { translations } from '../utils/translations';

export default function LandingPage({ onGetStarted, onOpenLogin, currentUser, lang }) {
  const t = translations[lang] || translations.en;
  
  const steps = [
    {
      number: "01",
      icon: Camera,
      title: t.step1Title,
      desc: t.step1Desc,
      color: "bg-sky-500",
      accent: "border-sky-200"
    },
    {
      number: "02",
      icon: Sparkles,
      title: t.step2Title,
      desc: t.step2Desc,
      color: "bg-cyan-500",
      accent: "border-cyan-200"
    },
    {
      number: "03",
      icon: MapPin,
      title: t.step3Title,
      desc: t.step3Desc,
      color: "bg-teal-500",
      accent: "border-teal-200"
    },
    {
      number: "04",
      icon: CheckCircle2,
      title: t.step4Title,
      desc: t.step4Desc,
      color: "bg-emerald-500",
      accent: "border-emerald-200"
    }
  ];

  return (
    <div className="space-y-16 pb-16 animate-in fade-in duration-500">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sky-100 via-sky-50 to-white pt-12 pb-20 border-b border-sky-100">
        
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-200/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white border border-sky-200 shadow-sm text-sky-700 text-xs font-extrabold animate-bounce">
              <ShieldCheck className="w-4 h-4 text-sky-600" />
              <span>{t.heroTag}</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              {t.heroHeading}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-3xl mx-auto">
              {t.heroDesc}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              
              <button
                onClick={currentUser ? () => onGetStarted('report') : onOpenLogin}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-sky-600 via-sky-700 to-cyan-600 hover:from-sky-500 hover:to-cyan-600 text-white font-extrabold text-sm shadow-xl shadow-sky-600/25 transition transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center space-x-2"
              >
                <Camera className="w-5 h-5" />
                <span>{t.fileComplaintBtn}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={() => onGetStarted('map')}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white hover:bg-sky-50 text-slate-700 font-extrabold text-sm border border-sky-200 shadow-sm transition flex items-center justify-center space-x-2"
              >
                <MapPin className="w-5 h-5 text-sky-600" />
                <span>{t.viewMapBtn}</span>
              </button>

            </div>

          </div>

          {/* Live System Stats Ribbon */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-5xl mx-auto">
            
            <div className="govt-card p-5 text-center">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">{t.statFixed}</span>
              <p className="text-3xl font-black text-sky-600 mt-1">1,482+</p>
              <span className="text-[11px] text-emerald-600 font-bold flex items-center justify-center space-x-1 mt-1">
                <Check className="w-3 h-3" />
                <span>100% Verified Proof</span>
              </span>
            </div>

            <div className="govt-card p-5 text-center">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">{t.statAccuracy}</span>
              <p className="text-3xl font-black text-cyan-600 mt-1">94.6%</p>
              <span className="text-[11px] text-slate-500 font-medium mt-1 block">YOLOv8 Vision Model</span>
            </div>

            <div className="govt-card p-5 text-center">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">{t.statRepairTime}</span>
              <p className="text-3xl font-black text-teal-600 mt-1">18.4 Hrs</p>
              <span className="text-[11px] text-slate-500 font-medium mt-1 block">Direct Ward Dispatch</span>
            </div>

            <div className="govt-card p-5 text-center">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">{t.statPoints}</span>
              <p className="text-3xl font-black text-amber-500 mt-1">74,100</p>
              <span className="text-[11px] text-amber-600 font-bold mt-1 block">Citizen Rewards</span>
            </div>

          </div>

        </div>

      </section>

      {/* HOW TO USE / PROCESS FLOW SECTION */}
      <section className="max-w-7xl mx-auto px-4 space-y-10">
        
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-extrabold">
            <Zap className="w-4 h-4 text-sky-600" />
            <span>{t.howToUseTag}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            {t.howToUseHeading}
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto font-medium">
            {t.howToUseDesc}
          </p>
        </div>

        {/* 4-Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div 
                key={index}
                className={`govt-card p-6 relative overflow-hidden space-y-4 border ${step.accent} hover:shadow-xl transition transform hover:-translate-y-1`}
              >
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl ${step.color} text-white flex items-center justify-center shadow-md`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-3xl font-black text-slate-200">
                    {step.number}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-extrabold text-slate-900">{step.title}</h3>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {step.desc}
                </p>

                <div className="pt-2 flex items-center space-x-1 text-[11px] font-bold text-sky-600">
                  <span>Step {step.number}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>

              </div>
            );
          })}
        </div>

      </section>

      {/* KEY FEATURES SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4">
        
        <div className="govt-card-sky rounded-3xl p-8 sm:p-12 border border-sky-200 space-y-8">
          
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">Advanced Innovations</span>
            <h2 className="text-3xl font-extrabold text-slate-900">
              {t.whySwachhTitle}
            </h2>
            <p className="text-sm text-slate-600 font-medium">
              {t.whySwachhDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-white p-6 rounded-2xl border border-sky-100 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                🛡️
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm">{t.feature1Title}</h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                {t.feature1Desc}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-sky-100 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                📷
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm">{t.feature2Title}</h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                {t.feature2Desc}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-sky-100 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                🏆
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm">{t.feature3Title}</h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                {t.feature3Desc}
              </p>
            </div>

          </div>

          <div className="pt-4 text-center">
            <button
              onClick={currentUser ? () => onGetStarted('report') : onOpenLogin}
              className="px-8 py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs shadow-lg shadow-sky-600/25 transition transform hover:scale-105"
            >
              {t.fileComplaintBtn}
            </button>
          </div>

        </div>

      </section>

    </div>
  );
}
