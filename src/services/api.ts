const API_BASE_URL = 'http://localhost:3000/api';
import { mockEvaluationResult } from '../mocks/evaluation';

export async function generateStory(language: string = 'English', level: string = 'intermediate', nativeLanguage?: string) {
  const response = await fetch(`${API_BASE_URL}/stories/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ language, level, nativeLanguage }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || 'Failed to generate story');
  }

  const data = await response.json();
  
  if (data.story.audio) {
    try {
      const audioBlob = await fetch(`data:audio/mp3;base64,${data.story.audio}`).then(r => r.blob());
      return {
        ...data.story,
        audio_url: URL.createObjectURL(audioBlob)
      };
    } catch (error) {
      console.error('Error creating audio URL:', error);
      throw new Error('Failed to process audio data');
    }
  }
  
  throw new Error('No audio data received from server');
}

export async function evaluatePronunciation(originalText: string, audioBlob: Blob, nativeLanguage?: string) {
  // In development, return mock data immediately
  if (process.env.NODE_ENV === 'development') {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(mockEvaluationResult);
      }, 1500); // Simulate network delay
    });
  }

  const formData = new FormData();
  formData.append('originalText', originalText);
  formData.append('recording', audioBlob);
  if (nativeLanguage) {
    formData.append('nativeLanguage', nativeLanguage);
  }

  const response = await fetch(`${API_BASE_URL}/scores/evaluate`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to evaluate pronunciation');
  }

  return response.json();
}