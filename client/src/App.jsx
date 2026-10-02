import React, { useState, useEffect } from 'react';
import OfficialHeader from './components/OfficialHeader';
import Navbar from './components/Navbar';
import SidebarNav from './components/SidebarNav';
import LandingPage from './components/LandingPage';
import LoginModal from './components/LoginModal';
import CitizenReport from './components/CitizenReport';
import AIScanner from './components/AIScanner';
import AdminDashboard from './components/AdminDashboard';
import MapView from './components/MapView';
import Leaderboard from './components/Leaderboard';
import MyReports from './components/MyReports';
import AIAssistantBot from './components/AIAssistantBot';
import { fetchComplaints, initialMockComplaints } from './utils/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('landing');
  const [lang, setLang] = useState('en');
  const [complaints, setComplaints] = useState(initialMockComplaints);
  const [userPoints, setUserPoints] = useState(150);

  // Authentication State
  const [currentUser, setCurrentUser] = useState(null); // null or user object
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      const apiData = await fetchComplaints();
      if (apiData && apiData.length > 0) {
        setComplaints(apiData);
      }
    }
    loadData();
  }, []);

  const handleLoginSuccess = (userObj) => {
    setCurrentUser(userObj);
    setIsLoginOpen(false);
    if (userObj.role === 'admin') {
      setActiveTab('admin');
    } else {
      setActiveTab('report');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('landing');
  };

  const handleReportSubmitted = (newComplaint, isDuplicate) => {
    if (!isDuplicate && newComplaint) {
      setComplaints(prev => [newComplaint, ...prev]);
      setUserPoints(prev => prev + 50);
    }
  };

  return (
    <div className="min-h-screen bg-sky-50/50 text-slate-900 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      
      {/* Official Government Header Top Bar */}
      <OfficialHeader 
        lang={lang}
        setLang={setLang}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenLogin={() => setIsLoginOpen(true)}
        userPoints={userPoints}
      />

      {/* BEFORE LOGIN: Top Navigation Bar | AFTER LOGIN: Left Collapsible Sidebar */}
      {!currentUser ? (
        <Navbar 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          lang={lang}
          currentUser={currentUser}
          onOpenLogin={() => setIsLoginOpen(true)}
        />
      ) : (
        <SidebarNav 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          lang={lang}
          currentUser={currentUser}
        />
      )}

      {/* Main Tab Content View with left padding offset when logged in */}
      <main className={`flex-1 transition-all duration-300 ${currentUser ? 'pl-16 sm:pl-20' : ''}`}>
        {activeTab === 'landing' && (
          <LandingPage 
            onGetStarted={(tab) => {
              if (!currentUser) setIsLoginOpen(true);
              else setActiveTab(tab);
            }}
            onOpenLogin={() => setIsLoginOpen(true)}
            currentUser={currentUser}
            lang={lang}
          />
        )}

        {activeTab === 'report' && (
          <CitizenReport 
            lang={lang}
            onReportSubmitted={handleReportSubmitted}
            existingComplaints={complaints}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'scanner' && (
          <AIScanner />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard 
            complaints={complaints}
            setComplaints={setComplaints}
            lang={lang}
          />
        )}

        {activeTab === 'map' && (
          <MapView 
            complaints={complaints}
            lang={lang}
          />
        )}

        {activeTab === 'leaderboard' && (
          <Leaderboard 
            lang={lang}
            userPoints={userPoints}
          />
        )}

        {activeTab === 'my-reports' && (
          <MyReports 
            complaints={complaints}
            lang={lang}
            currentUser={currentUser}
          />
        )}
      </main>

      {/* Floating AI Assistant Bot Widget in Bottom-Right Corner */}
      <AIAssistantBot lang={lang} />

      {/* Claymorphic Login / Auth Modal */}
      <LoginModal 
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        lang={lang}
      />

      {/* Official Footer */}
      <footer className={`bg-white border-t border-sky-100 py-8 text-slate-600 text-xs transition-all duration-300 ${currentUser ? 'pl-16 sm:pl-20' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold">
              🛡️
            </div>
            <div>
              <span className="font-extrabold text-slate-900 block">SwachhCheck National Portal</span>
              <span className="text-[11px] text-slate-500">Government Smart City AI Civic Damage Detection Engine</span>
            </div>
          </div>

          <div className="text-center md:text-right text-[11px] text-slate-500 space-y-1">
            <p>© 2026 Smart Cities Mission | Government of India</p>
            <p>Designed for Municipal Corporations & Gram Panchayats</p>
          </div>

        </div>
      </footer>

    </div>
  );
}
