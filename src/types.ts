export interface Message {
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  audioUrl?: string;
  correction?: SpeechCorrection;
}

export interface SpeechCorrection {
  rawTranscription: string;
  hasErrors: boolean;
  improvedSpeech: string;
  grammarMistakes: string[];
  vocabularyTips: string[];
  technicalAccuracyScore: number; // 0 - 100
  fluencyScore: number; // 0 - 100
  accentOrPronunciationTips: string;
  recommendedPhrases: string[];
}

export interface VocabularyWord {
  id: string;
  category: string;
  term: string;
  pronunciationSpelled: string;
  meaning: string;
  exampleSentence: string;
  clientFriendlyExplanation: string;
}

export interface ConversationScenario {
  id: string;
  title: string;
  category: 'simulator' | 'interview' | 'scenario' | 'freelance';
  clientRole: string; // e.g., "Non-technical CEO", "Frustrated SOC Client", "Lead Security Engineer"
  description: string;
  initialMessage: string;
  objectives: string[];
  guidanceDocs: string;
}

export interface ReportExplainingGuide {
  title: string;
  threatLevel: 'Critical' | 'High' | 'Medium' | 'Low';
  technicalDetails: string;
  verbalSummary: string;
  impactAnalogy: string; // Explaining to CEO
  remediationPitchMessage: string; // Explaining to Devs
}

export interface DailyChallenge {
  id: string;
  title: string;
  prompt: string;
  challengeType: 'pitch' | 'summarize' | 'negotiate';
  xpReward: number;
}
