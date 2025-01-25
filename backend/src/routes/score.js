import { Router } from 'express';
import { openai, ttsClient } from '../index.js';

const router = Router();

// Evaluate user's pronunciation
router.post('/evaluate', async (req, res) => {
  try {
    const { originalText, userRecording, nativeLanguage } = req.body;

    // In a real implementation, you would:
    // 1. Convert the user's audio recording to text using a Speech-to-Text service
    // 2. Compare the text with the original using OpenAI for detailed analysis

    // Mock transcribed text for development
    const transcribedText = "In a small village nestled among rolin hills, there lived a curious young girl named Maya. Every morning, she would wake up early to watch the sunrise paint the sky in briliant shades of orange and pink.";

    // Get evaluation from OpenAI with structured output
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a helpful and precise language tutor. I will give you two pieces of text:

1. The "Original Text": This is the text the learner was supposed to read.
2. The "Transcribed Text": This is the text produced by a speech-to-text system from the learner's audio.

Your job is to:
• Compare the Original Text to the Transcribed Text.
• Determine how accurately the learner read the text.
• Identify specific words or phrases the learner may need extra practice on (e.g., words that differ or seem mispronounced based on transcription).

Please follow these rules for your response:
1. Return the results in **strict JSON** format (no markdown, no extra commentary).
2. Use the keys: **"score"** and **"words_to_practice"**.
3. **"score"** should be a numeric value (e.g., an integer from 0 to 100) indicating overall accuracy. Higher scores mean fewer transcription errors.
4. **"words_to_practice"** should be a list of individual words or short phrases the user needs to work on.
5. Do not include any keys other than "score" and "words_to_practice".`
        },
        {
          role: "user",
          content: `### Original Text:
${originalText}

### Transcribed Text:
${transcribedText}`
        }
      ],
      response_format: { type: "json_object" }
    });

    const evaluation = JSON.parse(completion.choices[0].message.content);

    // Generate audio and translations for each word to practice
    const wordPromises = evaluation.words_to_practice.map(async (word) => {
      const [audioResponse] = await ttsClient.synthesizeSpeech({
        input: { text: word },
        voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
        audioConfig: { 
          audioEncoding: 'MP3',
          speakingRate: 0.8,
          pitch: 0
        },
      });

      let translation = null;
      if (nativeLanguage) {
        const translationCompletion = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: `You are a professional translator. Translate the following word from English to ${nativeLanguage}. Provide only the translation, no explanations.`
            },
            {
              role: "user",
              content: word
            }
          ]
        });
        translation = translationCompletion.choices[0].message.content;
      }

      return {
        word,
        audio: audioResponse.audioContent.toString('base64'),
        translation
      };
    });

    const wordAudios = await Promise.all(wordPromises);

    // Format the final response
    const result = {
      overall_score: evaluation.score,
      feedback: wordAudios
    };

    res.json(result);
  } catch (error) {
    console.error('Error evaluating pronunciation:', error);
    res.status(500).json({ error: 'Failed to evaluate pronunciation' });
  }
});

export const scoreRoutes = router;