import React, { useState } from 'react';
import { Bot, X, Send, Sparkles, HelpCircle, ChevronRight, MessageSquare } from 'lucide-react';
import { translations } from '../utils/translations';

export default function AIAssistantBot({ lang }) {
  const t = translations[lang] || translations.en;
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: lang === 'hi' 
        ? "नमस्ते! मैं आपका स्वच्छ-चेक एआई सहायक हूँ। मैं आपको पोर्टल का उपयोग करने और शिकायत दर्ज करने में मदद कर सकता हूँ।" 
        : lang === 'mr'
        ? "नमस्कार! मी तुमचा स्वच्छ-चेक एआय सहाय्यक आहे. तक्रार कशी नोंदवायची ते मी तुम्हाला सांगू शकतो."
        : "Hello! I am your SwachhCheck AI Civic Guide. I can help you file complaints, explain AI scanning, or track repair status!"
    }
  ]);
  const [input, setInput] = useState('');

  const quickPrompts = [
    {
      q: "How to report an issue?",
      a: "Click 'Report Issue' -> Upload a photo of the pothole or garbage -> AI will auto-detect damage -> Click 'Submit Geotagged Complaint'!"
    },
    {
      q: "How does AI scanning work?",
      a: "Our YOLOv8 Computer Vision model instantly analyzes your image, draws a target bounding box, and computes confidence % and severity!"
    },
    {
      q: "What are Swachh Points?",
      a: "Citizens earn +50 Swachh Points for every verified report! Points place you on the Municipal Leaderboard with civic badges!"
    },
    {
      q: "What is Anti-Spam Duplicate Detection?",
      a: "If another citizen reported the same pothole within 15 meters, the system merges your vote into a high-priority ticket!"
    }
  ];

  const handleSend = (userText) => {
    const textToUse = userText || input;
    if (!textToUse.trim()) return;

    // Add User Message
    const userMsg = { sender: 'user', text: textToUse };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Generate Bot Response
    setTimeout(() => {
      let reply = "I'm here to assist you! You can click any quick topic above or use the navigation sidebar to explore reporting, live AI scanning, and city maps.";
      
      const lower = textToUse.toLowerCase();
      if (lower.includes('report') || lower.includes('pothole') || lower.includes('garbage') || lower.includes('complaint')) {
        reply = "To report an issue: 1) Go to 'Report Issue', 2) Upload a photo, 3) Let YOLOv8 AI auto-detect damage, 4) Click Submit. Your GPS location attaches automatically!";
      } else if (lower.includes('ai') || lower.includes('scan') || lower.includes('yolo')) {
        reply = "SwachhCheck uses YOLOv8 Small architecture running at ~1.1s inference time. It identifies 5 categories: Pothole, Garbage, Road Crack, Damaged Streetlight, and Water Leakage.";
      } else if (lower.includes('point') || lower.includes('reward') || lower.includes('leaderboard')) {
        reply = "You earn +50 Swachh Points for every verified report! Top citizen reporters earn badges like 'Civic Champion 🏆' on the Leaderboard.";
      } else if (lower.includes('proof') || lower.includes('resolved') || lower.includes('after')) {
        reply = "When municipal officers resolve a ticket, they must upload an 'After Repair' proof photo for 100% transparency!";
      }

      setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
    }, 500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      
      {/* Floating Chat Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="clay-button p-4 flex items-center space-x-2 shadow-2xl transition transform hover:scale-105 active:scale-95 group"
        >
          <div className="w-8 h-8 rounded-xl bg-white text-sky-700 flex items-center justify-center font-bold text-lg">
            🤖
          </div>
          <div className="text-left hidden sm:block">
            <span className="text-[10px] font-extrabold uppercase text-sky-200 block">AI Civic Guide</span>
            <span className="text-xs font-black text-white">Ask AI Assistant</span>
          </div>
          <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
        </button>
      )}

      {/* Chat Box Window */}
      {isOpen && (
        <div className="clay-card w-80 sm:w-96 p-5 relative overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-300">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-sky-100 pb-3 mb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-2xl bg-sky-600 text-white flex items-center justify-center text-lg font-bold shadow-md">
                🤖
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">SwachhAI Civic Guide</h3>
                <span className="text-[10px] font-bold text-emerald-600 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  <span>Online • Ready to Help</span>
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-sky-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="h-64 overflow-y-auto space-y-3 p-1 text-xs">
            
            {/* Quick Prompts Bar */}
            <div className="space-y-1.5 mb-3">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Quick Questions:</span>
              <div className="flex flex-wrap gap-1.5">
                {quickPrompts.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(item.q)}
                    className="text-[10px] font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 px-2.5 py-1 rounded-lg border border-sky-200 transition text-left"
                  >
                    {item.q}
                  </button>
                ))}
              </div>
            </div>

            {messages.map((msg, index) => (
              <div 
                key={index}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] p-3 rounded-2xl ${
                  msg.sender === 'user'
                    ? 'bg-sky-600 text-white font-medium rounded-tr-none'
                    : 'bg-sky-50 border border-sky-100 text-slate-800 font-medium rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}

          </div>

          {/* Input Bar */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-center space-x-2 pt-3 border-t border-sky-100 mt-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about SwachhCheck..."
              className="flex-1 bg-white border border-sky-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-sky-500 font-medium shadow-inner"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white shadow-sm transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

    </div>
  );
}
