import React, { useState } from 'react';
import { Shield, Award, Calendar, Activity, Zap, CheckCircle2, Lock, Star, ChevronRight, HelpCircle, AlertCircle, ShoppingBag } from 'lucide-react';
import { dailyChallenges } from '../data/scenarios';
import { DailyChallenge } from '../types';

export default function CyberDashboard({
  xp,
  level,
  streak,
  onAddXP,
  onOpenScenario
}: {
  xp: number;
  level: number;
  streak: number;
  onAddXP: (xp: number) => void;
  onOpenScenario: (category: string) => void;
}) {
  const [completedChallenges, setCompletedChallenges] = useState<Record<string, boolean>>({});
  const [activeChallengeFeedback, setActiveChallengeFeedback] = useState<string | null>(null);
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(null);
  const [monetizationModel, setMonetizationModel] = useState<'free' | 'pro' | 'premium_mock'>('free');
  const [successPurchase, setSuccessPurchase] = useState<boolean>(false);

  // Derive title from user level
  const getUserRank = (lvl: number) => {
    if (lvl <= 2) return { title: 'Comms Intern', desc: 'Understanding basic terminology, trying to avoid standard filler words.', color: 'text-gray-400 border-gray-800' };
    if (lvl <= 4) return { title: 'SOC Dispatch Analyst', desc: 'Capable of presenting incident status factually to technical team leads.', color: 'text-cyan-400 border-cyan-500/20' };
    if (lvl <= 6) return { title: 'Pentester Advisor', desc: 'Explains complex logical flaws using clean analogies to Product Managers.', color: 'text-emerald-400 border-emerald-500/20 animate-pulse' };
    if (lvl <= 8) return { title: 'Incident Commander', desc: 'Directs panicked executives during network breach emergencies with absolute composure.', color: 'text-orange-400 border-orange-500/20' };
    return { title: 'Cyber Diplomat Pro', desc: 'Ultimate security advisor. Fluent, professional negotiation & boardroom ready.', color: 'text-pink-500 border-pink-500/20' };
  };

  const currentRank = getUserRank(level);

  // Mock complete checking challenge
  const handleCompleteChallenge = (challenge: DailyChallenge) => {
    if (completedChallenges[challenge.id]) return;
    
    setSelectedChallengeId(challenge.id);
    setActiveChallengeFeedback(`Recording Speech session simulation...\nProcessing pronunciation filters...\nDetecting filler rate...`);
    
    setTimeout(() => {
      setCompletedChallenges(prev => ({ ...prev, [challenge.id]: true }));
      onAddXP(challenge.xpReward);
      setActiveChallengeFeedback(`SUCCESS: Challenge Completed!\nXP Earned: +${challenge.xpReward} XP.\nFeedback: Your 1-minute brief was highly persuasive and concise. Excellent pitch structure!`);
    }, 2000);
  };

  // Simulated purchase triggers
  const executeSimulatedBuy = (tier: 'pro' | 'premium_mock') => {
    setMonetizationModel(tier);
    setSuccessPurchase(true);
    setTimeout(() => {
      setSuccessPurchase(false);
    }, 4000);
  };

  return (
    <div className="space-y-6" id="dashboard-workspace">
      {/* Level Progress Banner */}
      <div className="bg-gradient-to-br from-[#101014] to-[#0A0A0C] border border-[#1F1F23] rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden" id="level-hud-banner">
        {/* Futuristic glowing matrix lines */}
        <div className="absolute top-0 right-0 w-64 h-full bg-radial-gradient from-[#00F5FF]/5 to-transparent pointer-events-none" />
        
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-[#00F5FF]/10 border border-[#00F5FF]/25 flex flex-col items-center justify-center p-2 text-center shadow-[0_0_15px_rgba(0,245,255,0.05)]">
            <span className="text-[10px] font-mono font-bold text-[#00F5FF] tracking-wider">LEVEL</span>
            <span className="text-xl font-bold text-white font-mono leading-none">{level}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-mono font-bold ${currentRank.color} border px-2 py-0.5 rounded uppercase tracking-widest text-[10px]`}>
                {currentRank.title}
              </span>
              <span className="text-xs text-gray-400 font-mono">Rank Progression</span>
            </div>
            <p className="text-xs text-gray-300 mt-1 max-w-md font-sans">
              "{currentRank.desc}"
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex-1 max-w-md space-y-1">
          <div className="flex justify-between text-[11px] font-mono text-gray-400">
            <span>XP Tracker: {xp % 200}/200</span>
            <span>Next Level: {level + 1}</span>
          </div>
          <div className="w-full bg-[#1F1F23] h-3 rounded-full border border-[#2F2F35]/40 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-[#00F5FF] to-[#0055FF] h-full transition-all duration-500" 
              style={{ width: `${((xp % 200) / 200) * 100}%` }}
            />
          </div>
        </div>

        {/* Streak Counter */}
        <div className="flex items-center gap-3 border-l border-[#1F1F23] pl-0 md:pl-6">
          <div className="text-right">
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">Daily Streak</span>
            <span className="text-lg font-bold text-white font-mono mt-0.5 block">{streak} Days Practice</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#FF6B00]/10 border border-[#FF6B00]/25 flex items-center justify-center text-[#FF6B00]">
            <Calendar className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Grid of Stats and Daily challenges */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Section 1: Custom Vector Analytic Charts (fluency progress indicators) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#0A0A0C] border border-[#1F1F23] rounded-2xl p-6 space-y-4" id="stats-analytic-card">
            <h3 className="text-sm font-semibold text-gray-300 font-mono tracking-wider uppercase flex items-center gap-2 border-b border-[#1F1F23] pb-2.5">
              <Activity className="w-4 h-4 text-[#00F5FF]" />
              Fluency & Speaking Analytics Matrix
            </h3>

            {/* Custom SVG Performance Polygon */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-1 flex flex-col items-center justify-center p-3 relative h-48 bg-[#141418] rounded-xl border border-[#1F1F23]">
                {/* SVG Radial Web */}
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                  {/* Outer rings */}
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#1F1F23" strokeWidth="1" />
                  <circle cx="50" cy="50" r="25" fill="none" stroke="#1F1F23" strokeWidth="1" />
                  <circle cx="50" cy="50" r="10" fill="none" stroke="#1F1F23" strokeWidth="1" strokeDasharray="2,2" />
                  
                  {/* Axes */}
                  <line x1="50" y1="10" x2="50" y2="90" stroke="#1F1F23" strokeWidth="1" />
                  <line x1="10" y1="50" x2="90" y2="50" stroke="#1F1F23" strokeWidth="1" />

                  {/* Filled Performance Shape (fluency, filler words, tech accuracy, vocabulary) */}
                  <polygon 
                    points="50,18 80,50 50,78 28,50" 
                    fill="rgba(0, 245, 255, 0.15)" 
                    stroke="#00F5FF" 
                    strokeWidth="1.5"
                  />
                  
                  {/* Outer Indicators labels */}
                  <circle cx="50" cy="18" r="2.5" fill="#00FF9D" />
                  <circle cx="80" cy="50" r="2.5" fill="#00F5FF" />
                  <circle cx="50" cy="78" r="2.5" fill="#FF6B00" />
                  <circle cx="28" cy="50" r="2.5" fill="#00FF9D" />
                </svg>

                <div className="absolute inset-0 flex flex-col justify-end p-2 text-center text-[9px] font-mono text-gray-500">
                  <span>Accuracy Axis Matrix</span>
                </div>
              </div>

              {/* Statistical Progress block */}
              <div className="md:col-span-2 space-y-3.5">
                {/* Metr 1 */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-gray-400">Verbal Fluency Index</span>
                    <span className="text-[#00F5FF] font-bold">84% (+6% vs last week)</span>
                  </div>
                  <div className="w-full bg-[#1F1F23] h-2 rounded overflow-hidden">
                    <div className="bg-[#00F5FF] h-full" style={{ width: '84%' }} />
                  </div>
                </div>

                {/* Metr 2 */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-gray-400">Filler Word Drop Rate</span>
                    <span className="text-[#00FF9D] font-bold">88% (Excellent)</span>
                  </div>
                  <div className="w-full bg-[#1F1F23] h-2 rounded overflow-hidden">
                    <div className="bg-[#00FF9D] h-full" style={{ width: '88%' }} />
                  </div>
                </div>

                {/* Metr 3 */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-gray-400">Technical Jargon Accuracy</span>
                    <span className="text-[#FF6B00] font-bold">75% (Needs Practice)</span>
                  </div>
                  <div className="w-full bg-[#1F1F23] h-2 rounded overflow-hidden">
                    <div className="bg-[#FF6B00] h-full" style={{ width: '75%' }} />
                  </div>
                </div>

                {/* Metr 4 */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-gray-400">Accent Clarity Rating</span>
                    <span className="text-[#00FF9D] font-bold">90% (Highly Clear)</span>
                  </div>
                  <div className="w-full bg-[#1F1F23] h-2 rounded overflow-hidden">
                    <div className="bg-[#00FF9D] h-full" style={{ width: '90%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Daily challenges list */}
          <div className="bg-[#0A0A0C] border border-[#1F1F23] rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-semibold text-gray-300 font-mono tracking-wider uppercase flex items-center gap-2 border-b border-[#1F1F23] pb-2.5">
              <Zap className="w-4 h-4 text-[#FF6B00]" />
              Daily Vocabulary & Speaking Challenges
            </h3>

            <div className="space-y-3">
              {dailyChallenges.map((challenge) => (
                <div 
                  key={challenge.id} 
                  className="bg-[#141418] border border-[#1F1F23] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-[#2F2F35] transition-all"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white group-hover:text-[#00F5FF] transition-colors">
                        {challenge.title}
                      </h4>
                      <span className="text-[9px] uppercase font-mono font-medium tracking-wider bg-[#FF6B00]/15 text-[#FF6B00] px-1.5 py-0.5 rounded">
                        {challenge.challengeType}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed font-sans">
                      {challenge.prompt}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 justify-end leading-none">
                    <span className="text-xs font-mono font-bold text-[#00FF9D]">
                      +{challenge.xpReward} XP
                    </span>

                    <button
                      onClick={() => handleCompleteChallenge(challenge)}
                      disabled={completedChallenges[challenge.id] || (selectedChallengeId === challenge.id && activeChallengeFeedback?.includes('Recording'))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all ${
                        completedChallenges[challenge.id]
                          ? 'bg-[#0A0A0C] border border-[#00FF9D]/20 text-[#00FF9D]'
                          : 'bg-gradient-to-r from-[#00F5FF] to-[#0055FF] text-black hover:opacity-90'
                      }`}
                    >
                      {completedChallenges[challenge.id] ? 'COMPLETED ✓' : 'TAKE BRIEF'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {activeChallengeFeedback && (
              <div className="bg-[#050507] border border-[#FF6B00]/10 rounded-xl p-3 text-xs font-mono text-gray-300 whitespace-pre-line leading-relaxed">
                <span className="text-[#FF6B00] block mb-1">Challenge Terminal Tracker:</span>
                {activeChallengeFeedback}
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Badges Unlocked & Subscriptions Frame */}
        <div className="lg:col-span-1 space-y-6">
          {/* Unlock Badge Section */}
          <div className="bg-[#0A0A0C] border border-[#1F1F23] rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-semibold text-gray-300 font-mono tracking-wider uppercase flex items-center gap-2 border-b border-[#1F1F23] pb-2.5">
              <Award className="w-4 h-4 text-[#FF6B00]" />
              Credentials & Badges
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#141418] p-3 rounded-xl border border-[#1F1F23] flex flex-col items-center text-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  streak >= 1 ? 'bg-[#FF6B00]/10 text-[#FF6B00] border border-[#FF6B00]/25' : 'bg-[#0A0A0C] text-gray-600 border border-[#1F1F23]'
                }`}>
                  <Zap className="w-5 h-5" />
                </div>
                <span className="font-semibold text-white text-[11px] block">First Contact</span>
                <span className="text-[9px] text-gray-500 block font-mono">1 Session</span>
              </div>

              <div className="bg-[#141418] p-3 rounded-xl border border-[#1F1F23] flex flex-col items-center text-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  level >= 2 ? 'bg-[#00FF9D]/10 text-[#00FF9D] border border-[#00FF9D]/25' : 'bg-[#0A0A0C] text-gray-600 border border-[#1F1F23]'
                }`}>
                  <Shield className="w-5 h-5" />
                </div>
                <span className="font-semibold text-white text-[11px] block">Security Cadet</span>
                <span className="text-[9px] text-gray-500 block font-mono">Level 2</span>
              </div>

              <div className="bg-[#141418] p-3 rounded-xl border border-[#1F1F23] flex flex-col items-center text-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  xp >= 200 ? 'bg-[#00F5FF]/10 text-[#00F5FF] border border-[#00F5FF]/25' : 'bg-[#0A0A0C] text-gray-600 border border-[#1F1F23]'
                }`}>
                  <Star className="w-5 h-5" />
                </div>
                <span className="font-semibold text-white text-[11px] block">Vocab Cadet</span>
                <span className="text-[9px] text-gray-500 block font-mono">200 XP</span>
              </div>

              <div className="bg-[#141418] p-3 rounded-xl border border-[#1F1F23] flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-full bg-[#0A0A0C] text-gray-600 border border-[#1F1F23] flex items-center justify-center mb-2">
                  <Lock className="w-5 h-5" />
                </div>
                <span className="font-semibold text-gray-500 text-[11px] block">CISO Room</span>
                <span className="text-[9px] text-gray-600 block font-mono">Level 6</span>
              </div>
            </div>
          </div>

          {/* Integration: Monetization Ready Tiering */}
          <div className="bg-[#0A0A0C] border border-[#1F1F23] rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-semibold text-gray-300 font-mono tracking-wider uppercase flex items-center gap-2 border-b border-[#1F1F23] pb-2.5 text-[#00F5FF]">
              <ShoppingBag className="w-4 h-4" />
              CyberSpeak Subscriptions
            </h3>

            {successPurchase && (
              <div className="bg-[#00FF9D]/10 border border-[#00FF9D]/20 rounded p-3 text-xs text-[#00FF9D] font-mono text-center animate-bounce">
                SUCCESS: Simulated Tier Upgrade Active!
              </div>
            )}

            <div className="space-y-3">
              {/* Box 1 */}
              <div className={`p-3 rounded-xl border transition-all ${
                monetizationModel === 'free' ? 'border-[#00F5FF] bg-[#141418]' : 'border-[#1F1F23] bg-[#141418]/40'
              }`}>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-white font-mono">Free Scout Tier</span>
                  <span className="text-xs font-semibold text-gray-500 font-mono">Active</span>
                </div>
                <p className="text-[11px] text-gray-400 mt-1.5 max-w-sm">
                  Limited simulation runs, basic vocabulary access, standard coach audits.
                </p>
              </div>

              {/* Box 2 */}
              <div className={`p-4 rounded-xl border transition-all ${
                monetizationModel === 'pro' ? 'border-[#00F5FF] bg-[#141418]' : 'border-[#1F1F23] hover:border-[#2F2F35] bg-[#141418]/40'
              }`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold font-mono text-white">Pro Comms Tier</span>
                    <span className="text-[9px] bg-[#00F5FF]/10 text-[#00F5FF] font-black px-1.5 py-0.5 rounded uppercase font-mono">Hot</span>
                  </div>
                  <span className="text-sm font-mono font-bold text-[#00FF9D]">$29/mo</span>
                </div>
                <p className="text-[11px] text-gray-400 mt-1.5">
                  Unlimited AI sessions, high fidelity Gemini speech synthesis (TTS) hours, unlimited PDF findings compiler scans.
                </p>
                {monetizationModel !== 'pro' && (
                  <button
                    onClick={() => executeSimulatedBuy('pro')}
                    className="w-full mt-3 bg-gradient-to-r from-[#00F5FF] to-[#0055FF] text-black py-1.5 rounded-lg font-mono text-[11px] font-extrabold hover:opacity-90 transition-all font-bold block"
                  >
                    ACTIVATE 7-DAY FREE TRIAL
                  </button>
                )}
              </div>

              {/* Box 3 */}
              <div className={`p-4 rounded-xl border transition-all ${
                monetizationModel === 'premium_mock' ? 'border-[#00F5FF] bg-[#141418]' : 'border-[#1F1F23] hover:border-[#2F2F35] bg-[#141418]/40'
              }`}>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold font-mono text-white">Premium Package</span>
                  <span className="text-sm font-mono font-bold text-[#00F5FF]">$49 setup</span>
                </div>
                <p className="text-[11px] text-gray-400 mt-1.5">
                  Preps you for actual interviews with live customized SOC / Red team managers. Access 45 customized challenge sets.
                </p>
                {monetizationModel !== 'premium_mock' && (
                  <button
                    onClick={() => executeSimulatedBuy('premium_mock')}
                    className="w-full mt-3 bg-[#141418] hover:bg-[#1F1F23] text-white border border-[#2F2F35] py-1.5 rounded-lg font-mono text-[11px] font-bold transition-all block"
                  >
                    PURCHASE PACKET
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
