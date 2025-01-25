import { Router } from 'express';
import { ttsClient } from '../index.js';

const router = Router();

// Generate speech from text
router.get('/generate', async (req, res) => {
  const { text, voice, audioConfig, ssmlGender, languageName } = req.query;

  if (!text) {
    return res.status(400).json({ 
      error: 'Text is required' 
    });
  }

  try {
    const request = {
      input: { text },
      voice: { 
        name: languageName,
        languageCode: voice || 'en-US',
        ssmlGender: ssmlGender || 'NEUTRAL'
      },
      audioConfig: { 
        audioEncoding: 'MP3',
        speakingRate: 0.9, // Slightly slower for better clarity
        pitch: 0,
        volumeGainDb: 0
      },
    };

    const [response] = await ttsClient.synthesizeSpeech(request);
    
    // For word pronunciations, return base64 encoded audio
    if (req.query.returnBase64) {
      return res.json({
        audio: response.audioContent.toString('base64')
      });
    }

    // For full story audio, return binary audio data
    res.set('Content-Type', 'audio/mpeg');
    res.set('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
    res.send(response.audioContent);

  } catch (err) {
    console.error('Text-to-speech error:', err);
    
    if (err.code === 7) {
      res.status(400).json({ 
        error: 'Invalid text or language configuration',
        details: err.message
      });
    } else if (err.code === 14) {
      res.status(429).json({ 
        error: 'Text-to-speech quota exceeded',
        details: 'Please try again later'
      });
    } else {
      res.status(500).json({ 
        error: 'Failed to generate speech',
        details: 'An unexpected error occurred'
      });
    }
  }
});

export const ttsRoutes = router;