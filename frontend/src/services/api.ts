import axios, { AxiosError } from 'axios';
import { mockStory, useMockStory } from '../mocks/story';
import { Story } from '../types';
import { mockEvaluationResult } from '../mocks/evaluation';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const generateStory = async (language: string, level: string, nativeLanguage?: string): Promise<Story> => {
  if (useMockStory) {
    console.info('Using mock story data');
    return mockStory;
  }

  console.info('Requesting story generation:', { language, level, nativeLanguage });
  try {
    const response = await axios.post(`${API_BASE_URL}/stories/generate`, {
      language,
      level,
      nativeLanguage
    });
    
    // Access the story object from the response
    const story = response.data.story;
    
    console.debug('Story received:', {
      title: story.title,
      contentLength: story.content.length,
      hasTranslation: !!story.translation,
      hasAudio: !!story.audio
    });
    
    return story;
  } catch (error) {
    console.error('Failed to generate story:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      language,
      level,
      nativeLanguage
    });
    throw error;
  }
};

export async function evaluatePronunciation(originalText: string, audioBlob: Blob, nativeLanguage?: string) {
  // Ensure we're sending with the correct filename and extension
  const formData = new FormData();
  
  // Create a new file with proper name and type
  const file = new File([audioBlob], 'recording.webm', { 
    type: audioBlob.type || 'audio/webm' 
  });
  
  formData.append('recording', file);
  formData.append('originalText', originalText);
  if (nativeLanguage) {
    formData.append('nativeLanguage', nativeLanguage);
  }

  console.debug('Sending evaluation request:', {
    audioType: file.type,
    audioSize: file.size,
    fileName: file.name
  });

  const response = await fetch(`${API_BASE_URL}/scores/evaluate`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to evaluate pronunciation: ${errorText}`);
  }

  return response.json();
}

export const submitScore = async (userId: string, storyId: string, score: number) => {
  console.info('Submitting score:', { userId, storyId, score });
  try {
    const response = await axios.post('/score/submit', {
      userId,
      storyId,
      score
    });
    console.debug('Score submitted successfully');
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError;
    console.error('Failed to submit score:', {
      error: axiosError?.message || 'Unknown error',
      userId,
      storyId,
      score
    });
    throw error;
  }
};