import { Router } from 'express';
import { openai } from '../index.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { text, target } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a professional translator. Translate the following text from English to ${target}. Provide only the translation, no explanations or additional text.`
        },
        {
          role: "user",
          content: text
        }
      ]
    });

    const translation = completion.choices[0].message.content;

    res.json({ translation });
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ error: 'Failed to translate text' });
  }
});

export const translateRoutes = router;