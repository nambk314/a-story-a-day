import { Router } from 'express';
import { openai, ttsClient } from '../index.js';

const router = Router();

// Generate a new story
router.post('/generate', async (req, res) => {
  try {
    const { language = 'English', level = 'intermediate', nativeLanguage } = req.body;

    // Generate story using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a language learning assistant. Create a short story (150-200 words) suitable for ${level} level ${language} learners. The story should be engaging and use common vocabulary and grammar patterns. Return only the story text without any additional formatting or explanation.`
        }
      ],
      temperature: 0.7,
    });

    const storyText = completion.choices[0].message.content;

    // Generate translation if native language is provided
    let translation = null;
    if (nativeLanguage) {
      const translationCompletion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are a professional translator. Translate the following text from English to ${nativeLanguage}. Provide only the translation, no explanations or additional text.`
          },
          {
            role: "user",
            content: storyText
          }
        ]
      });
      translation = translationCompletion.choices[0].message.content;
    }

    // Generate audio using Google Text-to-Speech
    const request = {
      input: { text: storyText },
      voice: { languageCode: getLanguageCode(language), ssmlGender: 'NEUTRAL' },
      audioConfig: { audioEncoding: 'MP3' },
    };

    const [response] = await ttsClient.synthesizeSpeech(request);
    const audioContent = response.audioContent.toString('base64');

    res.json({
      story: {
        title: `Daily ${language} Story`,
        content: storyText,
        translation,
        audio: audioContent,
        language,
        level,
        created_at: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error generating story:', error);
    res.status(500).json({ error: 'Failed to generate story' });
  }
});

function getLanguageCode(language) {
  const languageCodes = {
    'English': 'en-US',
    'Spanish': 'es-ES',
    'French': 'fr-FR',
    'German': 'de-DE',
    'Italian': 'it-IT',
    'Japanese': 'ja-JP',
    'Korean': 'ko-KR',
    'Chinese': 'cmn-CN',
    // Add more languages as needed
  };
  return languageCodes[language] || 'en-US';
}

export const storyRoutes = router;