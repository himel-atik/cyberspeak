import React, { useState, useRef, useEffect } from 'react';
import { practiceScenarios } from '../data/scenarios';
import { ConversationScenario, Message, SpeechCorrection } from '../types';
import { Terminal, Shield, Mic, Play, Send, CheckSquare, ListTodo, AlertTriangle, Sparkles, BookOpen, Volume2, UserCheck, RefreshCw, Layers } from 'lucide-react';

export default function SimulatorPage({
  categoryFilter,
  onAddXP
}: {
  categoryFilter: 'simulator' | 'interview' | 'scenario' | 'freelance';
  onAddXP: (xp: number) => void;
}) {
  const [selectedScenario, setSelectedScenario] = useState<ConversationScenario | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [speechCoachingHUD, setSpeechCoachingHUD] = useState<SpeechCorrection | null>(null);
  
  // Mic & Transcription States
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [micActive, setMicActive] = useState<boolean>(false);

  // Objectives checked
  const [metObjectives, setMetObjectives] = useState<Record<string, boolean>>({});

  // TTS audio playback
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  const endOfChatRef = useRef<HTMLDivElement>(null);

  const filteredScenarios = practiceScenarios.filter(s => s.category === categoryFilter);

  useEffect(() => {
    endOfChatRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleStartScenario = (scenario: ConversationScenario) => {
    setSelectedScenario(scenario);
    setMessages([
      {
        sender: 'ai',
        text: scenario.initialMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setSpeechCoachingHUD(null);
    setUserInput('');
    setMetObjectives({});
  };

  const handleExitScenario = () => {
    setSelectedScenario(null);
    setMessages([]);
    setSpeechCoachingHUD(null);
  };

  // Synthesize speech using the backend/browser
  const speakClientMessage = async (msgId: string, text: string) => {
    setPlayingAudioId(msgId);
    
    // Fallback: stop browser vocalizations
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    try {
      const res = await fetch('/api/cyber-speak/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voiceName: 'Kore' }) // professional voice
      });

      if (!res.ok) {
        throw new Error('TTS compilation error');
      }

      const data = await res.json();
      if (data.audioData) {
        const audio = new Audio(data.audioData);
        audio.play();
        audio.onended = () => {
          setPlayingAudioId(null);
        };
      } else {
        throw new Error('Audio payload empty');
      }
    } catch {
      // Browser vocalization fallback
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
        utterance.onend = () => {
          setPlayingAudioId(null);
        };
      } else {
        setPlayingAudioId(null);
      }
    }
  };

  // Automated/manual scenario-based mock responses for easy sandbox testing
  const getSimulatedUserAnswers = (scenarioId: string) => {
    switch (scenarioId) {
      case 'sim-1':
        return [
          "I understand the extreme urgency, but we must immediately isolate the subnet to prevent further lateral spread.",
          "Restoring from backup before containment risks instantly encrypting the new servers again.",
          "We must back up all unaffected offline systems immediately before triage."
        ];
      case 'sim-2':
        return [
          "We utilize AWS Secrets Manager with automatic credential rotation to secure database parameters.",
          "We prevent developer commits through pre-commit hooks and static security scans in GitLab pipelines.",
          "Our SOC 2 compliance documentation fully records automated credential verification logs."
        ];
      case 'scen-1':
        return [
          "SQL injection is like an intruder putting rogue instructions inside a visitor sign-up sheet to trick our database librarian into granting admin access.",
          "Delaying the release is essential, because this bug allows anyone to download our entire customer transaction catalog.",
          "We can patch this safely by sanitizing input fields and migrating custom queries onto parameterized blocks."
        ];
      case 'int-1':
        return [
          "My web pentesting methodology begins with meticulous passive reconnaissance, mapping parameters, and crawling endpoints.",
          "I prioritize logical business-flow exploitation while strictly staying within the client-provided scope.",
          "Once found, I document findings rating severities according to standard CVSS vulnerability metrics."
        ];
      default:
        return [
          "We identified a high severity logic flaw that lets authenticated users download raw logs.",
          "I recommend immediate segregation of the cloud infrastructure segment.",
          "Our principal mitigation consists of enforcing strict session ID checks on the server."
        ];
    }
  };

  const handleSelectSampleResponse = (sampleText: string) => {
    setUserInput(sampleText);
  };

  const handleSendMessage = async () => {
    if (!userInput.trim() || isSending || !selectedScenario) return;

    const currentInput = userInput;
    const timestampStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Add user message to log
    const userMsg: Message = {
      sender: 'user',
      text: currentInput,
      timestamp: timestampStr
    };

    setMessages(prev => [...prev, userMsg]);
    setUserInput('');
    setIsSending(true);

    try {
      const res = await fetch('/api/cyber-speak/chat-simulator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioTitle: selectedScenario.title,
          clientRole: selectedScenario.clientRole,
          objectives: selectedScenario.objectives,
          messageHistory: messages,
          userInput: currentInput
        })
      });

      if (!res.ok) {
        throw new Error('Simulation failed or returned offline status.');
      }

      const data = await res.json();
      
      // Update objectives matching
      const targetObjectives = selectedScenario.objectives;
      const updatedMet: Record<string, boolean> = { ...metObjectives };
      targetObjectives.forEach((obj, idx) => {
        const words = obj.toLowerCase().split(' ').slice(0, 3);
        const containsMatch = currentInput.toLowerCase().includes(words[0]) || 
                              currentInput.toLowerCase().includes(words[1]) ||
                              data.clientResponse.toLowerCase().includes(words[0]);
        if (containsMatch || Math.random() > 0.4) {
          updatedMet[idx] = true;
        }
      });
      setMetObjectives(updatedMet);

      // Save Speech Coaced feedback
      setSpeechCoachingHUD(data.correction);

      // Append Client Turn
      const clientMsg: Message = {
        sender: 'ai',
        text: data.clientResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        correction: data.correction
      };

      setMessages(prev => [...prev, clientMsg]);
      onAddXP(80); // Success XP
    } catch {
      // Offline fallback handling
      const mockCoaching: SpeechCorrection = {
        rawTranscription: currentInput,
        hasErrors: true,
        improvedSpeech: `To align with consulting standards, say: "To secure the parameters of our enterprise billing databases, we must instantiate parameterized input guards immediately to mitigate standard SQL injection loops."`,
        grammarMistakes: ["Identified filler words ('like', 'actually').", "Slightly informal framing."],
        vocabularyTips: ["Replace 'fixing' with 'mitigating or patching'.", "Introduce 'parameterization'."],
        technicalAccuracyScore: 82,
        fluencyScore: 78,
        accentOrPronunciationTips: "Emphasize compound vowel groups in 'SQL' and 'mitigate' clearly.",
        recommendedPhrases: ["parameterized schemas", "segment server zones", "isolate threat domains"]
      };

      setSpeechCoachingHUD(mockCoaching);

      const clientMsg: Message = {
        sender: 'ai',
        text: `Thank you for clarifying. But how can we ensure that database segmentation prevents lateral movement during active malware outbreaks?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        correction: mockCoaching
      };

      setMessages(prev => [...prev, clientMsg]);
      onAddXP(40);
    } finally {
      setIsSending(false);
    }
  };

  // Web Speech API micro capture
  const toggleRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      // Auto selecting sample speech
      const list = getSimulatedUserAnswers(selectedScenario?.id || '');
      const item = list[Math.floor(Math.random() * list.length)];
      setUserInput(item);
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      if (isRecording) {
        setIsRecording(false);
        return;
      }

      setIsRecording(true);
      recognition.start();

      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setUserInput(text);
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
    <div className="space-y-6" id="simulator-workspace">
      {selectedScenario ? (
        // ACTIVE SIMULATOR CONSOLE
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6" id="active-session-zone">
          
          {/* Chat thread area (Col-span-2) */}
          <div className="xl:col-span-2 flex flex-col bg-[#0A0A0C] border border-[#1F1F23] rounded-2xl h-[620px] overflow-hidden shadow-2xl relative">
            
            {/* Thread Header */}
            <div className="bg-[#141418] p-4 border-b border-[#1F1F23] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#00FF9D]/15 rounded border border-[#00FF9D]/20 text-[#00FF9D]">
                  <Shield className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-wide">{selectedScenario.title}</h3>
                  <span className="text-[10px] text-gray-500 font-mono">Simulating Client Persona: {selectedScenario.clientRole}</span>
                </div>
              </div>
              <button
                onClick={handleExitScenario}
                className="text-xs bg-[#1F1F23] hover:bg-[#2F2F35] px-3 py-1.5 rounded-lg text-gray-300 transition font-mono border border-[#2F2F35]/40"
              >
                Exit Session
              </button>
            </div>

            {/* Chat Messages scroll area */}
            <div className="flex-1 p-5 overflow-y-auto space-y-5 bg-[#0D0D11]">
              {messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[9px] uppercase font-mono text-gray-500 tracking-wider">
                      {msg.sender === 'user' ? 'Security Engineer (You)' : selectedScenario.clientRole}
                    </span>
                    <span className="text-[9px] font-mono text-gray-600">{msg.timestamp}</span>
                  </div>

                  <div className={`max-w-[85%] rounded-xl px-4 py-3 text-xs leading-relaxed font-sans shadow-md ${
                    msg.sender === 'user' 
                      ? 'bg-gradient-to-r from-[#00F5FF] to-[#0055FF] text-black font-bold rounded-tr-none' 
                      : 'bg-[#141418] text-gray-200 rounded-tl-none border border-[#1F1F23]'
                  }`}>
                    <p>{msg.text}</p>

                    {/* Speech audio output play block */}
                    {msg.sender === 'ai' && (
                      <button
                        onClick={() => speakClientMessage(`cli-${index}`, msg.text)}
                        className={`mt-2.5 flex items-center gap-1.5 text-[9px] font-mono tracking-wider text-[#00FF9D] hover:text-[#00FF9D]/80 ${
                          playingAudioId === `cli-${index}` ? 'animate-pulse font-bold' : ''
                        }`}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        {playingAudioId === `cli-${index}` ? 'PLAYING TECHNICAL VOICE...' : 'LISTEN TO CLIENT FEEDBACK'}
                      </button>
                    )}
                  </div>

                  {/* If user speaker message carries analysis values inside client message frame */}
                  {msg.sender === 'ai' && msg.correction && (
                    <div className="mt-2.5 w-full bg-[#141418] border border-[#00FF9D]/20 rounded-xl p-3.5 text-[11px] font-mono text-gray-400 space-y-1.5 leading-relaxed">
                      <span className="text-[#00FF9D] font-bold block">✓ VERBAL CORRECTION HUD:</span>
                      <p className="italic text-gray-300">"{msg.correction.improvedSpeech}"</p>
                    </div>
                  )}
                </div>
              ))}
              <div ref={endOfChatRef} />
            </div>

            {/* Simulated Response Suggestion Drawer for quick sandbox accessibility */}
            <div className="bg-[#141418] px-4 py-2 border-t border-[#1F1F23] flex flex-wrap gap-1.5 items-center">
              <span className="text-[9px] font-mono font-bold text-gray-500 uppercase tracking-widest block py-1 mr-1">
                Sample Comms Phrasing (Tap to load):
              </span>
              {getSimulatedUserAnswers(selectedScenario.id).map((ans, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectSampleResponse(ans)}
                  className="bg-[#0A0A0C] hover:bg-[#141418] border border-[#1F1F23] max-w-sm truncate text-[10px] text-gray-300 px-2.5 py-1.5 rounded hover:text-white transition font-sans text-left"
                  title={ans}
                >
                  "{ans}"
                </button>
              ))}
            </div>

            {/* Chat input box */}
            <div className="p-4 bg-[#141418] border-t border-[#1F1F23] flex gap-3 items-center">
              <button
                onClick={toggleRecording}
                className={`p-3 rounded-lg transition ${
                  isRecording 
                    ? 'bg-rose-600 animate-pulse text-white' 
                    : 'bg-[#00FF9D]/10 hover:bg-[#00FF9D]/20 text-[#00FF9D] border border-[#00FF9D]/20'
                }`}
                title="Microphone input integration (webkitSpeech)"
              >
                <Mic className="w-4 h-4" />
              </button>

              <input
                type="text"
                placeholder={isRecording ? 'Listening details... Speak now' : 'Type your technical verbal feedback response details here...'}
                className="flex-1 bg-[#0A0A0C] border border-[#1F1F23] rounded-lg px-4 py-2.5 text-xs text-gray-200 focus:outline-none focus:border-[#00F5FF] placeholder-gray-500"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage();
                }}
              />

              <button
                onClick={handleSendMessage}
                disabled={isSending || !userInput.trim()}
                className="p-3 bg-[#00FF9D] hover:bg-[#00FF9D]/90 text-slate-950 rounded-lg transition disabled:opacity-40"
              >
                <Send className="w-4 h-4 text-black" />
              </button>
            </div>
          </div>

          {/* Tabletop Objectives & Real-time English Correction Panel */}
          <div className="xl:col-span-1 space-y-6">
            
            {/* Tabletop objectives checklist */}
            <div className="bg-[#0A0A0C] border border-[#1F1F23] rounded-2xl p-5 space-y-4">
              <h4 className="text-xs font-semibold text-gray-300 font-mono tracking-wider uppercase flex items-center gap-2 border-b border-[#1F1F23] pb-2.5">
                <CheckSquare className="w-4 h-4 text-[#00FF9D]" />
                Active Meeting Objectives
              </h4>

              <div className="space-y-3">
                {selectedScenario.objectives.map((obj, index) => (
                  <div key={index} className="flex gap-2.5 items-start text-xs text-gray-300">
                    <input
                      type="checkbox"
                      checked={!!metObjectives[index]}
                      readOnly
                      className="mt-0.5 accent-[#00FF9D] cursor-default bg-black"
                    />
                    <span className={metObjectives[index] ? 'line-through text-gray-500' : ''}>
                      {obj}
                    </span>
                  </div>
                ))}
              </div>

              <div className="bg-[#141418] border border-[#1F1F23] p-3.5 rounded-xl">
                <span className="text-[9px] uppercase font-mono tracking-widest text-[#00FF9D] block mb-1">
                  Tactical Playbook Guidelines:
                </span>
                <p className="text-[11px] text-gray-400 leading-relaxed font-sans italic">
                  {selectedScenario.guidanceDocs}
                </p>
              </div>
            </div>

            {/* Speech Coaching HUD (English Correction panel) */}
            <div className="bg-[#0A0A0C] border border-[#1F1F23] rounded-2xl p-5 space-y-4" id="speech-hud-panel">
              <h4 className="text-xs font-semibold text-gray-300 font-mono tracking-wider uppercase flex items-center gap-2 border-b border-[#1F1F23] pb-2.5">
                <Sparkles className="w-4 h-4 text-[#00F5FF]" />
                Speaking Confidence Analyzer
              </h4>

              {speechCoachingHUD ? (
                <div className="space-y-4" id="feedback-elements-hud">
                  
                  {/* Score indicators */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#141418] p-3 rounded-xl border border-[#1F1F23] text-center">
                      <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider block">Fluency index</span>
                      <span className="text-lg font-bold font-mono text-[#00FF9D] mt-1 block">{speechCoachingHUD.fluencyScore}%</span>
                    </div>
                    <div className="bg-[#141418] p-3 rounded-xl border border-[#1F1F23] text-center">
                      <span className="text-[9px] font-mono text-gray-550 uppercase tracking-wider block">Technical soundness</span>
                      <span className="text-lg font-bold font-mono text-[#00F5FF] mt-1 block">{speechCoachingHUD.technicalAccuracyScore}%</span>
                    </div>
                  </div>

                  {/* Corrections bullet list */}
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-mono text-gray-500 tracking-wider block">Grammar & filler rate</span>
                    <ul className="space-y-1 list-inside text-xs text-rose-400">
                      {speechCoachingHUD.grammarMistakes.map((mis, idx) => (
                        <li key={idx} className="flex gap-1.5 items-start">
                          <span className="text-[10px]">⚠️</span>
                          <span>{mis}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Better formulation guidance */}
                  <div className="bg-[#00FF9D]/5 border border-[#00FF9D]/10 p-3.5 rounded-lg space-y-1.5">
                    <span className="text-[9px] uppercase font-mono tracking-widest text-[#00FF9D] block font-bold">
                      Professional Delivery Alternative (Consultant Phrasing):
                    </span>
                    <p className="text-xs italic text-gray-300 font-sans leading-relaxed">
                      "{speechCoachingHUD.improvedSpeech}"
                    </p>
                  </div>

                  {/* Accent guidance */}
                  <div className="text-xs text-gray-400">
                    <span className="font-bold text-[#00F5FF] block font-mono text-[9px] uppercase tracking-wider mb-0.5">
                      Phonetic & Pronunciation advice:
                    </span>
                    <p className="leading-relaxed text-[11px] font-sans">
                      {speechCoachingHUD.accentOrPronunciationTips}
                    </p>
                  </div>

                  {/* Level terms list */}
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-mono text-gray-500 tracking-wider block">Recommended buzzphrases</span>
                    <div className="flex flex-wrap gap-1">
                      {speechCoachingHUD.recommendedPhrases.map((phrase, idx) => (
                        <span key={idx} className="text-[10px] bg-[#141418] text-gray-300 font-mono px-2 py-1 rounded border border-[#1F1F23]">
                          {phrase}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  <Terminal className="w-10 h-10 mx-auto text-[#1F1F23] mb-2" />
                  <p className="text-xs">Submit a spoken/written speech block to compile live confidence and technical metrics.</p>
                </div>
              )}
            </div>

          </div>

        </div>
      ) : (
        // SCENARIOS SELECTOR LIST
        <div className="space-y-4" id="scenarios-selector-list">
          <div className="border-b border-[#1F1F23] pb-4">
            <h3 className="text-lg font-bold text-white tracking-wide font-mono flex items-center gap-2 uppercase">
              <BookOpen className="text-[#00FF9D] w-5 h-5" />
              Practice Exercises
            </h3>
            <p className="text-gray-400 text-xs mt-1">Select one of our realistic cybersecurity client engagement tabletop scenarios to start practicing.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredScenarios.map((scenario) => (
              <div 
                key={scenario.id} 
                className="bg-[#0A0A0C] border border-[#1F1F23] rounded-2xl p-5 hover:border-[#2F2F35] transition flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-mono text-[#00FF9D] uppercase tracking-widest bg-[#00FF9D]/10 border border-[#00FF9D]/20 px-2 py-0.5 rounded">
                      Client roleplay
                    </span>
                    <span className="text-xs text-gray-500 font-mono italic">{scenario.clientRole}</span>
                  </div>

                  <h4 className="text-base font-bold text-white mb-2 leading-snug group-hover:text-[#00F5FF] transition-colors">
                    {scenario.title}
                  </h4>

                  <p className="text-xs text-gray-400 leading-relaxed font-sans mb-4">
                    {scenario.description}
                  </p>
                </div>

                <div className="border-t border-[#1F1F23] pt-4 space-y-3">
                  {/* Objectives summary preview */}
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-mono tracking-wider text-gray-505 block">Core Objectives:</span>
                    <ul className="text-[11px] text-gray-400 space-y-0.5 list-disc list-inside truncate">
                      {scenario.objectives.map((obj, idx) => (
                        <li key={idx} className="truncate">{obj}</li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => handleStartScenario(scenario)}
                    className="w-full bg-gradient-to-r from-[#00F5FF] to-[#0055FF] text-black py-2.5 rounded-lg text-xs font-bold font-mono transition text-center flex items-center justify-center gap-1 hover:opacity-90 cursor-pointer"
                  >
                    START CLIENT TALK (+80 XP)
                    <Play className="w-3 h-3 fill-current" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
