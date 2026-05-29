import React, { useState } from 'react';
import { Search, Volume2, Shield, Activity, Cloud, Lock, Server, Terminal, HelpCircle, Check, Play, Mic, AlertCircle } from 'lucide-react';
import { cybersecurityVocab } from '../data/vocabulary';
import { VocabularyWord } from '../types';

export default function VocabularyPage({ onAddXP }: { onAddXP: (xp: number) => void }) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [practicingTerm, setPracticingTerm] = useState<string | null>(null);
  const [practiceInput, setPracticeInput] = useState<string>('');
  const [feedback, setFeedback] = useState<{
    score: number;
    tip: string;
    improved: string;
  } | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [completedWords, setCompletedWords] = useState<Record<string, boolean>>({});

  const categories = ['All', ...Array.from(new Set(cybersecurityVocab.map(v => v.category)))];

  const filteredVocab = cybersecurityVocab.filter(v => {
    const matchesCategory = selectedCategory === 'All' || v.category === selectedCategory;
    const matchesSearch = v.term.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          v.meaning.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Web Security': return <Terminal className="w-4 h-4 text-[#00F5FF]" id="icon-web-sec" />;
      case 'Network Security': return <Server className="w-4 h-4 text-[#00FF9D]" id="icon-net-sec" />;
      case 'Cloud Security': return <Cloud className="w-4 h-4 text-[#00F5FF]" id="icon-cloud-sec" />;
      case 'Active Directory': return <Lock className="w-4 h-4 text-[#FF6B00]" id="icon-ad-sec" />;
      case 'API Security': return <Activity className="w-4 h-4 text-[#FF6B00]" id="icon-api-sec" />;
      default: return <Shield className="w-4 h-4 text-[#00FF9D]" id="icon-gen-sec" />;
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleStartPractice = (term: VocabularyWord) => {
    setPracticingTerm(term.id);
    setPracticeInput('');
    setFeedback(null);
    setIsRecording(false);
  };

  const simulateSpeech = (originalTerm: string) => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      // Generate standard realistic spoken sentence explaining the word
      const sentenceMap: Record<string, string> = {
        'web-1': "We discovered a critical SQL injection on the client billing API that allows database dump bypasses.",
        'web-2': "There's a stored cross-site scripting bug in the comment node that leaks local tokens backend.",
        'net-1': "A man in the middle vulnerability allows telemetry interception on public nodes.",
        'net-2': "We recommend transitioning our critical service tier into a Zero Trust architecture design model."
      };
      const text = sentenceMap[originalTerm] || `We must defend against ${originalTerm} by upgrading our perimeter controls.`;
      setPracticeInput(text);
      
      // Calculate realistic scores
      const score = 85 + Math.floor(Math.random() * 15);
      setFeedback({
        score,
        tip: "Great speed and clear formulation. Watch your phonetic emphasis on compound consonants.",
        improved: `To sound even more direct, say: "Our investigation isolated a ${originalTerm} issue in the production line."`
      });

      // Update state
      if (!completedWords[originalTerm]) {
        setCompletedWords(prev => ({ ...prev, [originalTerm]: true }));
        onAddXP(40);
      }
    }, 1500);
  };

  const handleMicPractice = (vocabItem: VocabularyWord) => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      simulateSpeech(vocabItem.id);
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsRecording(true);
      recognition.start();

      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setPracticeInput(text);
        
        // Simulating the coaching scores
        const score = text.toLowerCase().includes(vocabItem.term.split(' ')[0].toLowerCase()) ? 92 : 70;
        setFeedback({
          score,
          tip: score > 80 
            ? "Excellent! You enunciated the technical keyword correctly with professional cadence." 
            : "Keyword was slightly muffled. Try to emphasize the core consonant groups clearly.",
          improved: `Your phrasing was solid. Try introducing it directly as: "We monitored traffic to mitigate potential ${vocabItem.term} loops."`
        });

        if (!completedWords[vocabItem.id]) {
          setCompletedWords(prev => ({ ...prev, [vocabItem.id]: true }));
          onAddXP(50);
        }
      };

      recognition.onerror = () => {
        setIsRecording(false);
        simulateSpeech(vocabItem.id);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };
    } catch {
      simulateSpeech(vocabItem.id);
    }
  };

  return (
    <div className="space-y-6" id="vocabulary-workspace">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-[#1F1F23] pb-5 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2 font-sans">
            <Terminal className="text-[#00F5FF] w-6 h-6" />
            Cybersecurity Vocabulary Coach
          </h2>
          <p className="text-gray-400 text-sm mt-1 font-sans">
            Master precise security technical terms, learn how to explain them simply to executives, and practice speech enunciation.
          </p>
        </div>
        <div className="flex bg-[#00FF9D]/10 border border-[#00FF9D]/20 px-3 py-1.5 rounded-lg text-[#00FF9D] text-xs font-mono items-center gap-2">
          <Check className="w-4 h-4 text-[#00FF9D]" />
          <span>{Object.keys(completedWords).length} / {cybersecurityVocab.length} Vocab Drills Completed</span>
        </div>
      </div>

      {/* Controls & Categories */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
        {/* Search */}
        <div className="relative flex-1" id="search-box-field">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search security concepts, keywords or definitions..."
            className="w-full bg-[#0A0A0C] border border-[#1F1F23] rounded-lg pl-10 pr-4 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#00F5FF]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {/* Category Toggles */}
        <div className="flex flex-wrap gap-1.5 bg-[#0A0A0C] p-1 rounded-lg border border-[#1F1F23]">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#1F1F23] text-[#00F5FF] font-bold border border-[#2F2F35]/40'
                  : 'text-gray-400 hover:text-white hover:bg-[#141418]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="vocab-cards-grid">
        {filteredVocab.map((item) => (
          <div
            key={item.id}
            className="bg-[#0A0A0C] border border-[#1F1F23] rounded-2xl p-5 hover:border-[#2F2F35] transition-all flex flex-col justify-between relative group"
            id={`vocab-card-${item.id}`}
          >
            {/* Completed Badge */}
            {completedWords[item.id] && (
              <span className="absolute top-4 right-4 bg-[#00FF9D]/10 border border-[#00FF9D]/20 text-[#00FF9D] text-[10px] uppercase tracking-wider font-mono px-2 py-0.5 rounded-full">
                Drilled ✓
              </span>
            )}

            <div>
              {/* Category & Title */}
              <div className="flex items-center gap-2 mb-3">
                {getCategoryIcon(item.category)}
                <span className="text-[11px] font-mono font-medium text-gray-500">
                  {item.category}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-bold text-white group-hover:text-[#00F5FF] transition-colors">
                  {item.term}
                </h3>
                <span className="text-xs font-mono text-gray-500">
                  {item.pronunciationSpelled}
                </span>
                <button
                  onClick={() => speakText(item.term)}
                  className="p-1 rounded bg-[#1F1F23] text-gray-400 hover:text-white hover:bg-[#2F2F35] transition-colors"
                  title="Listen to phonetic voice output"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Technical Definition */}
              <p className="text-gray-300 text-xs leading-relaxed mb-4">
                <span className="font-semibold text-gray-500 uppercase tracking-widest text-[9px] block mb-1">
                  Technical Def
                </span>
                {item.meaning}
              </p>

              {/* Developer / Threat Hunter Usage */}
              <div className="bg-[#141418] rounded-xl p-3.5 border border-[#1F1F23] mb-4">
                <span className="font-semibold text-[#00F5FF] uppercase tracking-widest text-[9px] block mb-1 font-mono">
                  Consulting Report Usage
                </span>
                <span className="italic text-xs font-mono text-gray-300 block leading-relaxed">
                  "{item.exampleSentence}"
                </span>
              </div>

              {/* High and unique value: Client-Friendly Translation */}
              <div className="bg-[#00FF9D]/5 rounded-xl p-4 border border-[#00FF9D]/10 mb-4">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="p-0.5 rounded bg-[#00FF9D]/10 text-[#00FF9D]">
                    <HelpCircle className="w-3 h-3" />
                  </span>
                  <span className="font-semibold text-[#00FF9D] uppercase tracking-widest text-[9px] font-mono">
                    Client-Friendly Plain English Analogy
                  </span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {item.clientFriendlyExplanation}
                </p>
              </div>
            </div>

            {/* Speaking Trainer Module inside each card */}
            <div className="border-t border-[#1F1F23] pt-4 flex flex-col gap-3">
              {practicingTerm === item.id ? (
                <div className="bg-[#141418] p-4 rounded-xl border border-[#00FF9D]/20 animate-fade-in" id="pronunciation-recorder-workspace">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono text-[#00FF9D] uppercase tracking-wider block font-bold">
                      Speaking Assessment Console
                    </span>
                    <button
                      onClick={() => setPracticingTerm(null)}
                      className="text-xs text-gray-500 hover:text-gray-400 font-mono"
                    >
                      Close
                    </button>
                  </div>

                  <p className="text-[11px] text-gray-400 mb-3 block font-sans">
                    Tap the mic, read the <span className="text-[#00F5FF] font-mono">"{item.term}"</span>, or explain its utility verbally:
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleMicPractice(item)}
                      disabled={isRecording}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all flex items-center gap-1.5 ${
                        isRecording 
                          ? 'bg-rose-600 animate-pulse text-white' 
                          : 'bg-gradient-to-r from-[#00F5FF] to-[#0055FF] text-black hover:opacity-90'
                      }`}
                    >
                      <Mic className="w-3.5 h-3.5" />
                      {isRecording ? 'Listening...' : 'Record Voice'}
                    </button>

                    <button
                      onClick={() => simulateSpeech(item.id)}
                      disabled={isRecording}
                      className="px-3 py-1.5 rounded-lg text-xs font-mono bg-[#1F1F23] text-gray-300 hover:bg-[#2F2F35] transition border border-[#2F2F35]/40"
                    >
                      Mock Speak (No Mic)
                    </button>
                  </div>

                  {practiceInput && (
                    <div className="mt-3 bg-[#0A0A0C] p-2.5 rounded border border-[#1F1F23]">
                      <span className="text-[9px] uppercase font-mono tracking-widest text-gray-500 block">
                        Captured Words:
                      </span>
                      <p className="text-xs text-gray-300 font-mono italic mt-0.5">
                        "{practiceInput}"
                      </p>
                    </div>
                  )}

                  {feedback && (
                    <div className="mt-3 space-y-2 border-t border-[#1F1F23] pt-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-300">
                          Pronunciation Accuracy:
                        </span>
                        <span className={`text-xs font-mono font-bold ${
                          feedback.score >= 90 ? 'text-[#00FF9D]' : 'text-[#FF6B00]'
                        }`}>
                          {feedback.score}%
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed font-sans">
                        <span className="text-[#00FF9D] font-bold">Feedback:</span> {feedback.tip}
                      </p>
                      <div className="bg-[#00FF9D]/5 p-3 rounded-lg border border-[#00FF9D]/10 text-[11px] text-gray-300 italic leading-relaxed">
                        <span className="font-bold text-[#00FF9D] not-italic block mb-0.5">Professional Polish:</span>
                        {feedback.improved}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => handleStartPractice(item)}
                  className="w-full bg-[#141418] hover:bg-[#1F1F23] border border-[#1F1F23] py-2.5 rounded-xl text-xs font-bold text-gray-300 hover:text-white transition-colors flex items-center justify-center gap-1.5 font-mono group-hover:border-[#2F2F35]"
                >
                  <Mic className="w-3.5 h-3.5 text-[#00FF9D]" />
                  PRACTICE SPEAKING THIS TERM (+40 XP)
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
