import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

// Define port and runtime constants
const PORT = 3000;
const app = express();

// Set up server options
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Lazy init for Gemini API client to prevent crash if key is temporarily missing
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error('GEMINI_API_KEY environment variable is missing.');
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Ensure clean connection endpoint test
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

/**
 * Endpoint 1: Chat Simulator with English Correction
 * Uses gemini-3.5-flash to assess spoken/written input and construct the next interaction turn.
 */
app.post('/api/cyber-speak/chat-simulator', async (req: Request, res: Response) => {
  try {
    const { scenarioTitle, clientRole, objectives, promptText, messageHistory, userInput } = req.body;
    const ai = getGeminiClient();

    // Prepare message history in general structure
    const formattedHistory = (messageHistory || []).map((msg: any) => {
      return `${msg.sender === 'ai' ? 'Client' : 'User'}: ${msg.text}`;
    }).join('\n');

    const systemInstruction = `
      You are an expert Cybersecurity Communication Coach and an interactive Client Simulator.
      You are running a mock tabletop conversation under these conditions:
      - Scenario title: "${scenarioTitle}"
      - Your role is: "${clientRole}"
      - Key Objectives for the User to achieve during this conversation: ${JSON.stringify(objectives)}

      YOUR BEHAVIOR AS THE CLIENT:
      - Immersive execution. Remain strictly in character, responding realistically (may be anxious, demanding, technical, or skeptical as the persona demands).
      - Keep your reply concise (2-3 sentences), representing a natural speech turn.
      - Drive the scenario forward by challenging the user's technical reasoning or communication clarity.

      YOUR BEHAVIOR AS THE SPEECH COACH:
      - Analyze the latest user input: "${userInput || ''}"
      - Check for grammar mistakes, cybersecurity framing, sentence structure omissions, filler words (e.g., "like", "um", "ah", "basically", "you know"), and professional tone.
      - Keep the explanations very clean and clear for intermediate-to-advanced cybersecurity professionals.
      - Give score indicators for technical accuracy (evaluating how secure/truthful their explanation is) and fluency (grammar, vocabulary, clarity of delivery).

      You MUST respond with a strict JSON object mapping back to the client interface. Do not wrap your response in triple backticks outside of the JSON itself, and match the schema structure exactly.
    `;

    const userPrompt = `
      Current conversation logs:
      ${formattedHistory}

      User has responded with: "${userInput || '(Silence, user just started or listened)'}"

      Please generate the next client reply and complete the grammar correction context for this input.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          required: ['clientResponse', 'correction'],
          properties: {
            clientResponse: {
              type: Type.STRING,
              description: 'The verbal conversational reply from the client in-character. 2-3 sentences max.'
            },
            correction: {
              type: Type.OBJECT,
              required: [
                'rawTranscription',
                'hasErrors',
                'improvedSpeech',
                'grammarMistakes',
                'vocabularyTips',
                'technicalAccuracyScore',
                'fluencyScore',
                'accentOrPronunciationTips',
                'recommendedPhrases'
              ],
              properties: {
                rawTranscription: {
                  type: Type.STRING,
                  description: 'The user\'s original input text.'
                },
                hasErrors: {
                  type: Type.BOOLEAN,
                  description: 'True if there are noticeable improvements, fillers, or grammatical mistakes.'
                },
                improvedSpeech: {
                  type: Type.STRING,
                  description: 'A polished, highly professional, concise version of what they said. Make it sound like a top-tier security consultant.'
                },
                grammarMistakes: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'List of specific grammar, filler word, or tone errors highlighted.'
                },
                vocabularyTips: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Specific cybersecurity terminology advice (e.g. "Use \'containment\' instead of \'fixing it\'").'
                },
                technicalAccuracyScore: {
                  type: Type.INTEGER,
                  description: 'Score from 0 to 100 based on the technical soundness of the security explanation.'
                },
                fluencyScore: {
                  type: Type.INTEGER,
                  description: 'Score from 0 to 100 based on grammar, flow, fillers, and coherence.'
                },
                accentOrPronunciationTips: {
                  type: Type.STRING,
                  description: 'Phonetic or pronunciation tips for keywords used in the response.'
                },
                recommendedPhrases: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: '2-3 powerful cybersecurity phrases appropriate for this specific scenario turn.'
                }
              }
            }
          }
        }
      }
    });

    if (!response.text) {
      throw new Error('Gemini returned an empty responses.');
    }

    const payload = JSON.parse(response.text.trim());
    res.json(payload);
  } catch (error: any) {
    console.error('Error in chat-simulator endpoint:', error);
    res.status(500).json({ error: error.message || 'Error executing AI model simulation' });
  }
});

/**
 * Endpoint 2: Vulnerability / Pentest Report Analyzer
 * User inputs or uploads standard technical report text, AI analyzes and outputs a speech-coaching guide.
 */
app.post('/api/cyber-speak/analyze-report', async (req: Request, res: Response) => {
  try {
    const { reportText } = req.body;
    if (!reportText || reportText.trim().length === 0) {
      return res.status(400).json({ error: 'Please enter or upload a valid report snippet' });
    }

    const ai = getGeminiClient();

    const systemInstruction = `
      You are an elite Cybersecurity Presentation Coach.
      Your task is to analyze raw pentest notes or security findings, and generate a verbal-delivery guide.
      This helps the security engineer explain their findings confidently during high-level briefings.
      Keep output structured, clear, and perfectly focused on the balance between business logic and tech impact.
    `;

    const userPrompt = `
      Here is the raw vulnerability details:
      "${reportText}"

      Formulate a verbal explanation model in JSON.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          required: ['title', 'threatLevel', 'technicalDetails', 'verbalSummary', 'impactAnalogy', 'remediationPitchMessage'],
          properties: {
            title: {
              type: Type.STRING,
              description: 'Clear, concise name of the vulnerability/vulnerability category.'
            },
            threatLevel: {
              type: Type.STRING,
              description: 'Critical, High, Medium, or Low.'
            },
            technicalDetails: {
              type: Type.STRING,
              description: 'A 1-2 sentence technical breakdown of the underlying vulnerability mechanics.'
            },
            verbalSummary: {
              type: Type.STRING,
              description: 'How to explain this finding verbally in standard meetings. Clear, fluent, and highly professional language.'
            },
            impactAnalogy: {
              type: Type.STRING,
              description: 'An easy-to-understand analogy to explain the risk index to a completely non-technical CEO.'
            },
            remediationPitchMessage: {
              type: Type.STRING,
              description: 'The verbal pitch or justification to convince developers to prioritize the remediation immediately.'
            }
          }
        }
      }
    });

    if (!response.text) {
      throw new Error('Gemini returned an empty report explanation guide.');
    }

    const payload = JSON.parse(response.text.trim());
    res.json(payload);
  } catch (error: any) {
    console.error('Error in analyze-report endpoint:', error);
    res.status(500).json({ error: error.message || 'Error compiling verbal report briefing guide' });
  }
});

/**
 * Endpoint 3: Text to Speech (TTS)
 * Synthesizes chat responses using the high-quality gemini-3.1-flash-tts-preview model.
 */
app.post('/api/cyber-speak/tts', async (req: Request, res: Response) => {
  try {
    const { text, voiceName = 'Zephyr' } = req.body;
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text prompt cannot be empty' });
    }

    const ai = getGeminiClient();

    // Available voices: 'Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-tts-preview',
      contents: [{ parts: [{ text: `Say naturally: ${text}` }] }],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      throw new Error('No audio content returned from Gemini Speech API');
    }

    // Return the raw audio string as data URI ready for playback
    res.json({ audioData: `data:audio/wav;base64,${base64Audio}` });
  } catch (error: any) {
    console.error('Error generating Text-to-Speech via Gemini:', error);
    res.status(500).json({ error: error.message || 'Error compiling TTS audio session' });
  }
});

// Configure Vite middleware in development or build asset delivery in production
async function startApplication() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite middleware mounted for development workspace.');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CyberSpeak Pro backend active on port ${PORT}`);
  });
}

startApplication().catch((err) => {
  console.error('Fatal failure on server initialization:', err);
});
