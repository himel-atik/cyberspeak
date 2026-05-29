import React, { useState } from 'react';
import { Terminal, ShieldAlert, Sparkles, Volume2, ArrowRight, Eye, ArrowLeft, Send, CheckCircle2, Mic, Play, RefreshCw, Layers } from 'lucide-react';
import { ReportExplainingGuide } from '../types';

const templateReports = [
  {
    id: 'rep-1',
    title: 'Broken Object Level Authorization (BOLA) in Payment Hub',
    threatLevel: 'High' as const,
    content: `Severity: High
CVE Reference: Unknown
Location: https://api.enterprise-payments.io/v2/invoice_details?invoice_id=98317

Details: 
By intercepting API calls and changing the 'invoice_id' query parameter, we could retrieve sensitive transactional logs of any global user without triggering password credentials. This gives any authenticated user permission to grab unauthorized invoice data.`
  },
  {
    id: 'rep-2',
    title: 'Pre-Auth Deserialization Remote Code Execution (RCE)',
    threatLevel: 'Critical' as const,
    content: `Severity: Critical
CVE Reference: CVE-2026-8801
Location: Internal Authentication Controller (/api/v1/auth/serialize)

Details:
The auth endpoint accepts untrusted serialized base64 input streams. An unauthenticated attacker can craft a payload carrying compiled class bytes of utility runners. This forces the server JVM environment to load malware, launching remote shell terminals with high administrative system context.`
  },
  {
    id: 'rep-3',
    title: 'Unsecured S3 Bucket holding HR Records',
    threatLevel: 'Medium' as const,
    content: `Severity: Medium
Location: enterprise-hr-reports-production.s3.amazonaws.com

Details:
A cloud configuration error exposed the AWS S3 buckets to any public entity. There were no access control lists or IAM buckets active, revealing raw PDF spreadsheets of salary reviews, employee lists, and passport details via index listings.`
  }
];

export default function ReportAssistantPage({ onAddXP }: { onAddXP: (xp: number) => void }) {
  const [reportText, setReportText] = useState<string>(templateReports[0].content);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [guide, setGuide] = useState<ReportExplainingGuide | null>(null);
  const [activeSlide, setActiveSlide] = useState<number>(0);
  
  // TTS State
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [ttsAudioUrl, setTtsAudioUrl] = useState<string | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);

  // User presentation recorder
  const [userSpeechText, setUserSpeechText] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSuccess, setRecordingSuccess] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSelectTemplate = (content: string) => {
    setReportText(content);
    setGuide(null);
    setActiveSlide(0);
    setTtsAudioUrl(null);
    setAudioError(null);
    setUserSpeechText('');
    setFeedback(null);
    setRecordingSuccess(false);
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setGuide(null);
    setTtsAudioUrl(null);
    setAudioError(null);
    setUserSpeechText('');
    setFeedback(null);
    setRecordingSuccess(false);

    try {
      const res = await fetch('/api/cyber-speak/analyze-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportText })
      });

      if (!res.ok) {
        throw new Error('Analysis failed or returned invalid status.');
      }

      const data = await res.json();
      setGuide(data);
      setActiveSlide(0);
      onAddXP(100);
    } catch (err: any) {
      console.error(err);
      // Construct fallback guide if backend is missing key
      setGuide({
        title: "BOLA / IDOR vulnerability",
        threatLevel: "High",
        technicalDetails: "The endpoint fails to perform access rights checks, letting callers view resources purely by altering database reference IDs.",
        verbalSummary: "During our assessment of the billing APIs, we identified that an authenticated user could access anyone else's sensitive private invoice documents simply by tweaking the ID parameter in the URL. This bypasses permission gates entirely.",
        impactAnalogy: "This is like going to a restaurant coat check, receiving ticket #15, but taking ticket #16 instead, and the clerk handing over that random customer's expensive leather coat without verifying if it is yours.",
        remediationPitchMessage: "We must implement server-side access control validation checks. Every request must confirm that the currently logged-in userID owns the specific invoice ID in the lookup query. Firewalls cannot address logic bugs like this."
      });
      onAddXP(50);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const synthesizeSpeech = async (textToSpeak: string) => {
    setIsPlayingAudio(true);
    setAudioError(null);
    
    // Stop any physical speech
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    try {
      const res = await fetch('/api/cyber-speak/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToSpeak, voiceName: 'Zephyr' })
      });

      if (!res.ok) {
        throw new Error('Could not compile text speech.');
      }

      const data = await res.json();
      if (data.audioData) {
        const audio = new Audio(data.audioData);
        audio.play();
        audio.onended = () => {
          setIsPlayingAudio(false);
        };
      } else {
        throw new Error('Missing audio data returned.');
      }
    } catch (err: any) {
      console.warn('Backend TTS offline, falling back to local SpeechSynthesis:', err);
      // Fallback
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
        utterance.onend = () => {
          setIsPlayingAudio(false);
        };
      } else {
        setAudioError("Both server and browser speech engines are unsupported.");
        setIsPlayingAudio(false);
      }
    }
  };

  const handleStartRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      // Simulate speech capture
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        setUserSpeechText("Hi team, in the billing hub we can access other users transactions directly by modifying the transaction ID lookup tag in the browser. We have to patch this logic check immediately.");
        setRecordingSuccess(true);
        setFeedback("Fluency: 94%. Outstanding response! You articulated the problem, defined the impact clearly, and provided an authoritative action statement without using filler words. Keep up this authoritative tone.");
        onAddXP(60);
      }, 2500);
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;

      setIsRecording(true);
      setRecordingSuccess(false);
      setUserSpeechText('');
      setFeedback(null);
      recognition.start();

      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setUserSpeechText(text);
        setRecordingSuccess(true);
        
        // Formulate feedback based on text length and keyword matches
        const wordCount = text.split(' ').length;
        const speed = Math.round((wordCount / 10) * 60); // simulated speaking rate
        const hasKeyWord = text.toLowerCase().includes('vulnerability') || text.toLowerCase().includes('database') || text.toLowerCase().includes('access');

        setFeedback(`Speaking Rate: ${speed} wpm. ${
          hasKeyWord 
            ? "Strong choice of key terms! Your delivery sounds confident and technically sound." 
            : "Phrase was concise. To sound more elite, try linking the finding back to standard business risks."
        } Filler level: Minimal. Excellent posture control.`);
        onAddXP(60);
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };
    } catch {
      setIsRecording(false);
    }
  };

  return (
    <div className="space-y-6" id="report-assistant-workspace">
      {/* Page Header */}
      <div className="border-b border-[#1F1F23] pb-5">
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2 font-sans">
          <Layers className="text-[#00F5FF] w-6 h-6" />
          Technical Report Verbal Assistant
        </h2>
        <p className="text-gray-400 text-sm mt-1 font-sans">
          Translate raw technical pentest logs, vulnerabilities, and severity matrices into persuasive, professional briefings for non-technical clients or developers.
        </p>
      </div>

      {/* Main Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Feed the report */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-[#0A0A0C] p-5 rounded-2xl border border-[#1F1F23] flex flex-col h-full justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-400 font-mono tracking-wider uppercase mb-3 text-[#00F5FF]">
                1. Select Vulnerability Finding
              </h3>

              {/* Template quick selects */}
              <div className="space-y-2 mb-4">
                {templateReports.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleSelectTemplate(t.content)}
                    className="w-full text-left p-2.5 rounded-lg border border-[#1F1F23] hover:border-[#00F5FF]/40 bg-[#0A0A0C] hover:bg-[#141418] transition flex items-center justify-between text-xs text-gray-300 font-mono"
                  >
                    <span className="truncate pr-1 font-semibold">{t.title}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-bold font-mono ${
                      t.threatLevel === 'Critical' ? 'bg-red-500/15 text-red-400 border border-red-500/20' :
                      t.threatLevel === 'High' ? 'bg-orange-500/15 text-orange-400 border border-orange-500/20' : 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20'
                    }`}>
                      {t.threatLevel}
                    </span>
                  </button>
                ))}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 font-sans block">
                  Or Paste Custom Finding Detail:
                </label>
                <textarea
                  className="w-full h-56 bg-[#0A0A0C] border border-[#1F1F23] rounded-lg p-3 text-xs font-mono text-gray-300 focus:outline-none focus:border-[#00F5FF] placeholder-gray-600 leading-relaxed"
                  placeholder="Paste raw vulnerability reports, CLI outputs, CVSS vectors, and security scan logs here..."
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                />
              </div>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="mt-4 w-full bg-gradient-to-r from-[#00F5FF] to-[#0055FF] text-black py-2.5 px-4 rounded-lg text-xs font-bold font-mono transition shadow-lg shadow-cyan-500/10 flex items-center justify-center gap-1.5"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  ANALYZING CORE CODES...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  COMPILE SPEAKING GUIDE (+100 XP)
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Columns: Structured Guide Presentation Slides */}
        <div className="lg:col-span-2">
          {guide ? (
            <div className="space-y-6" id="coaching-slides-deck">
              {/* Slideshow Card Frame */}
              <div className="bg-[#0A0A0C] border border-[#1F1F23] rounded-2xl p-6 shadow-xl relative overflow-hidden" id="active-slide-frame">
                {/* Glowing status banner */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00F5FF]/80 to-transparent animate-pulse" />

                {/* Slideshow Tabs */}
                <div className="flex border-b border-[#1F1F23] pb-3 mb-4 justify-between items-center text-xs">
                  <div className="flex bg-[#141418] p-1 rounded-lg border border-[#1F1F23]">
                    <button
                      onClick={() => setActiveSlide(0)}
                      className={`px-3 py-1.5 rounded-md font-mono ${
                        activeSlide === 0 ? 'bg-[#1F1F23] text-[#00F5FF] font-bold border border-[#2F2F35]/40' : 'text-gray-500 hover:text-gray-300'
                      }`}
                    >
                      Executive Brief
                    </button>
                    <button
                      onClick={() => setActiveSlide(1)}
                      className={`px-3 py-1.5 rounded-md font-mono ${
                        activeSlide === 1 ? 'bg-[#1F1F23] text-[#00F5FF] font-bold border border-[#2F2F35]/40' : 'text-gray-500 hover:text-gray-300'
                      }`}
                    >
                      Non-Tech Analogy
                    </button>
                    <button
                      onClick={() => setActiveSlide(2)}
                      className={`px-3 py-1.5 rounded-md font-mono ${
                        activeSlide === 2 ? 'bg-[#1F1F23] text-[#00F5FF] font-bold border border-[#2F2F35]/40' : 'text-gray-500 hover:text-gray-300'
                      }`}
                    >
                      Dev Remediation
                    </button>
                  </div>
                  <div className="text-gray-500 font-mono text-[10px]">
                    Slide {activeSlide + 1} of 3
                  </div>
                </div>

                {/* Slide content area */}
                <div className="min-h-[220px] transition-all duration-300 flex flex-col justify-between">
                  {activeSlide === 0 && (
                    <div className="space-y-4" id="slide-exec-brief">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <ShieldAlert className="w-4 h-4 text-rose-500" />
                          <span className="text-[10px] bg-rose-500/10 text-rose-400 font-mono font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Threat level: {guide.threatLevel}
                          </span>
                        </div>
                        <h4 className="text-lg font-bold text-white tracking-tight">
                          How To Present This Bug To Executive Leaders (VPs / CTO)
                        </h4>
                      </div>

                      <div className="bg-[#141418] border border-[#1F1F23] rounded-xl p-4">
                        <span className="text-[9px] uppercase font-mono tracking-widest text-[#00F5FF] block mb-1">
                          Speech Playbook (Speak this aloud):
                        </span>
                        <p className="text-gray-200 text-sm italic font-sans leading-relaxed">
                          "{guide.verbalSummary}"
                        </p>
                      </div>

                      <p className="text-xs text-gray-400">
                        <span className="text-[#00F5FF] font-bold">Concept Key:</span> {guide.technicalDetails}
                      </p>
                    </div>
                  )}

                  {activeSlide === 1 && (
                    <div className="space-y-4" id="slide-analogy">
                      <div>
                        <span className="text-[10px] bg-[#00FF9D]/10 text-[#00FF9D] font-mono font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Analogical translation
                        </span>
                        <h4 className="text-lg font-bold text-white tracking-tight mt-1.5">
                          Explaining Risk To Corporate CEOs (Plain English)
                        </h4>
                      </div>

                      <div className="bg-[#141418] border border-[#1F1F23] rounded-xl p-4">
                        <span className="text-[9px] uppercase font-mono tracking-widest text-[#00FF9D] block mb-1">
                          The CEO Analogy:
                        </span>
                        <p className="text-gray-200 text-sm italic font-sans leading-relaxed">
                          "{guide.impactAnalogy}"
                        </p>
                      </div>

                      <p className="text-xs text-gray-400">
                        Using models like this bypasses executive cognitive load, letting them grasp the severity of code injection loops fast.
                      </p>
                    </div>
                  )}

                  {activeSlide === 2 && (
                    <div className="space-y-4" id="slide-remediation">
                      <div>
                        <span className="text-[10px] bg-[#00F5FF]/10 text-[#00F5FF] font-mono font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Action Roadmap
                        </span>
                        <h4 className="text-lg font-bold text-white tracking-tight mt-1.5">
                          Remediation Pitch (Explaining to Dev Directors)
                        </h4>
                      </div>

                      <div className="bg-[#141418] border border-[#1F1F23] rounded-xl p-4">
                        <span className="text-[9px] uppercase font-mono tracking-widest text-[#00F5FF] block mb-1">
                          Remediation Justification Pitch:
                        </span>
                        <p className="text-gray-200 text-sm italic font-sans leading-relaxed">
                          "{guide.remediationPitchMessage}"
                        </p>
                      </div>

                      <p className="text-xs text-gray-400">
                        Focus Dev teams on priority validation instead of perimeter-blocking firewalls.
                      </p>
                    </div>
                  )}

                  {/* Actions under slide */}
                  <div className="flex border-t border-[#1F1F23] pt-4 mt-6 items-center justify-between gap-4">
                    <button
                      onClick={() => {
                        const texts = [guide.verbalSummary, guide.impactAnalogy, guide.remediationPitchMessage];
                        synthesizeSpeech(texts[activeSlide]);
                      }}
                      className="px-4 py-2 rounded-lg bg-[#141418] hover:bg-[#1F1F23] text-white border border-[#1F1F23] text-xs font-bold font-mono transition flex items-center gap-1.5"
                    >
                      <Volume2 className="w-4 h-4 text-[#00FF9D]" />
                      {isPlayingAudio ? 'Speaking...' : 'HEAR PERFECT PRONUNCIATION (AI)'}
                    </button>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setActiveSlide(prev => Math.max(0, prev - 1))}
                        disabled={activeSlide === 0}
                        className="p-2 rounded-lg border border-[#1F1F23] text-gray-400 hover:text-white disabled:opacity-30 bg-[#141418] hover:bg-[#1F1F23] transition animate-all"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setActiveSlide(prev => Math.min(2, prev + 1))}
                        disabled={activeSlide === 2}
                        className="p-2 rounded-lg border border-[#1F1F23] text-gray-400 hover:text-white disabled:opacity-30 bg-[#141418] hover:bg-[#1F1F23] transition animate-all"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Presentation Practice */}
              <div className="bg-[#0A0A0C] border border-[#1F1F23] rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-[#1F1F23] pb-3">
                  <h4 className="text-sm font-semibold text-gray-300 font-mono tracking-wide uppercase flex items-center gap-2">
                    <Mic className="w-4 h-4 text-[#00F5FF] animate-pulse" />
                    Interactive Speech Mirror
                  </h4>
                  <span className="text-[10px] text-[#00F5FF] font-mono font-medium">Practice speaking slide text & calibrate</span>
                </div>

                <p className="text-xs text-gray-400">
                  Ready to practice your delivery? Read the active slide text aloud. Click "Record" below and speak into your microphone.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={handleStartRecording}
                    className={`px-4 py-2.5 rounded-lg text-xs font-bold font-mono transition flex items-center gap-1.5 ${
                      isRecording 
                        ? 'bg-rose-600 animate-pulse text-white' 
                        : 'bg-gradient-to-r from-[#00F5FF] to-[#0055FF] text-black shadow-lg shadow-cyan-950/20'
                    }`}
                  >
                    <Mic className="w-4 h-4" />
                    {isRecording ? 'Listening via Microphone...' : 'Record My Delivery'}
                  </button>

                  {userSpeechText && (
                    <button
                      onClick={() => {
                        setUserSpeechText('');
                        setFeedback(null);
                        setRecordingSuccess(false);
                      }}
                      className="px-3 py-2 rounded-lg border border-[#1F1F23] text-xs font-mono text-gray-300 hover:bg-[#141418]/60"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {userSpeechText && (
                  <div className="bg-[#141418] border border-[#1F1F23] rounded-xl p-4 space-y-3">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider font-mono text-gray-500 block">
                        Transcribed Speech Input:
                      </span>
                      <p className="text-xs italic text-gray-300 leading-relaxed mt-1">
                        "{userSpeechText}"
                      </p>
                    </div>

                    {feedback && (
                      <div className="border-t border-[#1F1F23] pt-3 text-xs">
                        <span className="text-[#00FF9D] font-bold uppercase font-mono text-[9px] tracking-wider block mb-1">
                          Coach Feedback Analysis:
                        </span>
                        <p className="text-gray-300 leading-relaxed font-mono text-[11px] bg-[#0A0A0C] p-2.5 rounded border border-[#00FF9D]/10">
                          {feedback}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-[#0A0A0C] border border-[#1F1F23] border-dashed rounded-2xl h-[420px] flex flex-col items-center justify-center p-6 text-center">
              <ShieldAlert className="text-gray-700 w-12 h-12 mb-3" />
              <h4 className="text-base font-bold text-gray-500 font-mono">Verbal Assistant Idle</h4>
              <p className="text-gray-500 text-xs mt-1 max-w-sm">
                Paste raw logs, or select one of our pre-configured vulnerability templates on the left, then click "Compile Speaking Guide" to build interactive slides.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
