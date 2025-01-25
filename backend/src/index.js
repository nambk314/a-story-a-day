import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';
import textToSpeech from '@google-cloud/text-to-speech';
import { storyRoutes } from './routes/story.js';
import { scoreRoutes } from './routes/score.js';
import { ttsRoutes } from './routes/tts.js';
import { translateRoutes } from './routes/translate.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize OpenAI
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Initialize Google Text-to-Speech
export const ttsClient = new textToSpeech.TextToSpeechClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
});

// Routes
app.use('/api/stories', storyRoutes);
app.use('/api/scores', scoreRoutes);
app.use('/api/tts', ttsRoutes);
app.use('/api/translate', translateRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});