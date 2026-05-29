import React, { useState, useEffect } from 'react';
import { Terminal, Shield, BookOpen, Activity, Play, Zap, Award, CheckCircle, HelpCircle, AlertTriangle, Layers, Menu, X, ArrowUpRight, Lock } from 'lucide-react';
import CyberDashboard from './components/CyberDashboard';
import SimulatorPage from './components/SimulatorPage';
import VocabularyPage from './components/VocabularyPage';
import ReportAssistantPage from './components/ReportAssistantPage';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Gamification metrics persisted locally
  const [xp, setXp] = useState<number>(() => {
    const saved = localStorage.getItem('cyberspeak_xp');
    return saved ? parseInt(saved, 10) : 120; // Starts at 120 so they are Lvl 1 but halfway
  });
  const [level, setLevel] = useState<number>(() => {
    const saved = localStorage.getItem('cyberspeak_level');
    return saved ? parseInt(saved, 10) : 1;
  });
  const [streak, setStreak] = useState<number>(() => {
    const saved = localStorage.getItem('cyberspeak_streak');
    return saved ? parseInt(saved, 10) : 3; // Initial streak
  });

  useEffect(() => {
    localStorage.setItem('cyberspeak_xp', xp.toString());
    localStorage.setItem('cyberspeak_level', level.toString());
    localStorage.setItem('cyberspeak_streak', streak.toString());
  }, [xp, level, streak]);

  const handleAddXP = (amount: number) => {
    setXp(prevXp => {
      const nextXp = prevXp + amount;
      const targetLevel = Math.floor(nextXp / 200) + 1;
      if (targetLevel > level) {
        setLevel(targetLevel);
        // Play level up trigger
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance("Congratulations! You leveled up. Excellent work, consultant.");
          utterance.rate = 1.0;
          window.speechSynthesis.speak(utterance);
        }
      }
      return nextXp;
    });
  };

  const getSidebarIcon = (tab: string) => {
    switch (tab) {
      case 'dashboard': return <Layers className="w-4 h-4" />;
      case 'simulator': return <Shield className="w-4 h-4" />;
      case 'scenario': return <Play className="w-4 h-4" />;
      case 'interview': return <Award className="w-4 h-4" />;
      case 'freelance': return <Zap className="w-4 h-4" />;
      case 'vocabulary': return <BookOpen className="w-4 h-4" />;
      case 'findings': return <Terminal className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  const getTabLabel = (tab: string) => {
    switch (tab) {
      case 'dashboard': return 'Dashboard Hub';
      case 'simulator': return 'AI Client Simulator';
      case 'scenario': return 'Scenario Learning';
      case 'interview': return 'Mock Interviews';
      case 'freelance': return 'Freelancer Objections';
      case 'vocabulary': return 'Security Vocab Coach';
      case 'findings': return 'Report Explainer';
      default: return 'Practice Suite';
    }
  };

  // Link inside dashboard to trigger route changes
  const handleOpenScenario = (category: string) => {
    setActiveTab(category);
  };

  return (
    <div className="min-h-screen text-[#E0E0E6] flex flex-col bg-[#050507] cyber-matrix-grid" id="main-frame-root">
      
      {/* Top Banner Status Bar */}
      <header className="bg-[#0A0A0C]/90 border-b border-[#1F1F23] px-5 py-4 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#00F5FF] to-[#0055FF] flex items-center justify-center text-slate-950 font-bold shadow-[0_0_15px_rgba(0,245,255,0.2)]">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white font-mono tracking-tight flex items-center gap-1.5 leading-none">
              CyberSpeak <span className="text-[10px] bg-gradient-to-r from-[#00F5FF] to-[#0055FF] text-black font-extrabold px-1.5 py-0.5 rounded font-mono">PRO</span>
            </h1>
            <span className="text-[9px] text-gray-400 font-mono tracking-widest uppercase block mt-1">Telemetry Comms Trainer</span>
          </div>
        </div>

        {/* Gamified HUD in Navbar */}
        <div className="hidden md:flex items-center gap-5 font-mono text-xs">
          <div className="flex items-center gap-1.5 text-[#FF6B00] bg-[#FF6B00]/10 px-2.5 py-1 rounded-lg border border-[#1F1F23]">
            <Zap className="w-3.5 h-3.5" />
            <span>{streak}d Streak</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#00FF9D] bg-[#00FF9D]/10 px-2.5 py-1 rounded-lg border border-[#1F1F23]">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>{xp} XP Total</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#00F5FF] bg-[#00F5FF]/10 px-2.5 py-1 rounded-lg border border-[#1F1F23]">
            <Shield className="w-3.5 h-3.5" />
            <span>Lvl {level} Analyst</span>
          </div>
        </div>

        {/* Responsive Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-gray-400 hover:text-white p-1"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      <div className="flex-1 flex flex-col md:flex-row relative">
        
        {/* Navigation Sidebar Drawer */}
        <aside className={`
          bg-[#0A0A0C] border-r border-[#1F1F23] w-full md:w-64 p-4 space-y-4 flex flex-col justify-between shrink-0
          ${mobileMenuOpen ? 'block' : 'hidden md:flex'}
          absolute md:relative z-20 top-0 left-0 bottom-0 md:bottom-auto h-full backdrop-blur-md md:backdrop-blur-none
        `} id="sidebar-drawer-rail">
          
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-[9px] font-mono font-bold text-gray-500 uppercase tracking-widest px-3 block mb-2">Primary Dash</span>
              <button
                onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-mono transition-all ${
                  activeTab === 'dashboard' 
                    ? 'bg-[#1F1F23] text-[#00F5FF] font-bold shadow-md shadow-cyan-500/5 border border-[#2F2F35]/40' 
                    : 'text-gray-400 hover:text-white hover:bg-[#141418]'
                }`}
              >
                <Layers className="w-4 h-4" />
                Dashboard HUB
              </button>
            </div>

            <div className="space-y-1">
              <span className="text-[9px] font-mono font-bold text-gray-500 uppercase tracking-widest px-3 block mb-2">Comms Scenarios</span>
              
              <button
                onClick={() => { setActiveTab('simulator'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-mono transition-all ${
                  activeTab === 'simulator' 
                    ? 'bg-[#1F1F23] text-[#00F5FF] font-bold border border-[#2F2F35]/40' 
                    : 'text-gray-400 hover:text-white hover:bg-[#141418]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Shield className="w-4 h-4" />
                  AI Client Simulator
                </div>
                <span className="text-[8px] bg-[#00F5FF]/10 text-[#00F5FF] px-1.5 py-0.5 rounded uppercase font-semibold">Active</span>
              </button>

              <button
                onClick={() => { setActiveTab('scenario'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-mono transition-all ${
                  activeTab === 'scenario' 
                    ? 'bg-[#1F1F23] text-[#00F5FF] font-bold border border-[#2F2F35]/40' 
                    : 'text-gray-400 hover:text-white hover:bg-[#141418]'
                }`}
              >
                <Play className="w-4 h-4" />
                Scenario Learning
              </button>

              <button
                onClick={() => { setActiveTab('interview'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-mono transition-all ${
                  activeTab === 'interview' 
                    ? 'bg-[#1F1F23] text-[#00F5FF] font-bold border border-[#2F2F35]/40' 
                    : 'text-gray-400 hover:text-white hover:bg-[#141418]'
                }`}
              >
                <Award className="w-4 h-4" />
                Mock Interviews
              </button>

              <button
                onClick={() => { setActiveTab('freelance'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-mono transition-all ${
                  activeTab === 'freelance' 
                    ? 'bg-[#1F1F23] text-[#00F5FF] font-bold border border-[#2F2F35]/40' 
                    : 'text-gray-400 hover:text-white hover:bg-[#141418]'
                }`}
              >
                <Zap className="w-4 h-4" />
                Freelancer Objections
              </button>
            </div>

            <div className="space-y-1">
              <span className="text-[9px] font-mono font-bold text-gray-500 uppercase tracking-widest px-3 block mb-2">Tools & Materials</span>
              
              <button
                onClick={() => { setActiveTab('vocabulary'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-mono transition-all ${
                  activeTab === 'vocabulary' 
                    ? 'bg-[#1F1F23] text-[#00F5FF] font-bold border border-[#2F2F35]/40' 
                    : 'text-gray-400 hover:text-white hover:bg-[#141418]'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                Security Vocab Coach
              </button>

              <button
                onClick={() => { setActiveTab('findings'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-mono transition-all ${
                  activeTab === 'findings' 
                    ? 'bg-[#1F1F23] text-[#00F5FF] font-bold border border-[#2F2F35]/40' 
                    : 'text-gray-400 hover:text-white hover:bg-[#141418]'
                }`}
              >
                <Terminal className="w-4 h-4" />
                Report Explainer
              </button>
            </div>
          </div>

          {/* Quick sidebar pro box */}
          <div className="bg-[#141418] rounded-xl p-4 border border-[#1F1F23]">
            <p className="text-[10px] text-gray-500 mb-1 uppercase tracking-widest font-bold">PRO SUBSCRIPTION</p>
            <p className="text-xs text-white font-medium">Pass SOC-2 Briefings</p>
            <button 
              onClick={() => setActiveTab('dashboard')} 
              className="w-full mt-2.5 bg-gradient-to-r from-[#00F5FF] to-[#0055FF] text-black text-[11px] font-bold py-1.5 rounded-lg hover:opacity-95 transition-all font-mono"
            >
              Learn More
            </button>
          </div>

          {/* Footer credentials overview */}
          <div className="border-t border-[#1F1F23] pt-4 text-[10px] space-y-1 text-gray-500 font-mono">
            <span className="block">ENVIRONMENT: CLOUD RUN</span>
            <span className="block">BENTO DESIGN SYSTEMS</span>
          </div>

        </aside>

        {/* Content Panel Frame */}
        <main className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto w-full space-y-6" id="dashboard-content-frame">
          
          {activeTab === 'dashboard' && (
            <CyberDashboard
              xp={xp}
              level={level}
              streak={streak}
              onAddXP={handleAddXP}
              onOpenScenario={handleOpenScenario}
            />
          )}

          {activeTab === 'simulator' && (
            <SimulatorPage 
              categoryFilter="simulator"
              onAddXP={handleAddXP}
            />
          )}

          {activeTab === 'scenario' && (
            <SimulatorPage 
              categoryFilter="scenario"
              onAddXP={handleAddXP}
            />
          )}

          {activeTab === 'interview' && (
            <SimulatorPage 
              categoryFilter="interview"
              onAddXP={handleAddXP}
            />
          )}

          {activeTab === 'freelance' && (
            <SimulatorPage 
              categoryFilter="freelance"
              onAddXP={handleAddXP}
            />
          )}

          {activeTab === 'vocabulary' && (
            <VocabularyPage 
              onAddXP={handleAddXP}
            />
          )}

          {activeTab === 'findings' && (
            <ReportAssistantPage 
              onAddXP={handleAddXP}
            />
          )}

        </main>

      </div>
    </div>
  );
}
