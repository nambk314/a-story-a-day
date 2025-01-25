import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Story, Recording } from '../types';
import { generateStory } from '../services/api';
import { mockStory } from '../mocks/story';
import { DEFAULT_TARGET_LANGUAGE } from '../constants/languages';

interface State {
  user: User | null;
  currentStory: Story | null;
  recordings: Recording[];
  isRecording: boolean;
  isDarkMode: boolean;
  mediaRecorder: MediaRecorder | null;
  isLoading: boolean;
  error: string | null;
  nativeLanguage: string | null;
  hasSelectedLanguage: boolean;
  setUser: (user: User | null) => void;
  setCurrentStory: (story: Story | null) => void;
  setRecordings: (recordings: Recording[]) => void;
  setIsRecording: (isRecording: boolean) => void;
  setIsDarkMode: (isDarkMode: boolean) => void;
  setMediaRecorder: (mediaRecorder: MediaRecorder | null) => void;
  generateNewStory: (language?: string, level?: string) => Promise<void>;
  clearError: () => void;
  setNativeLanguage: (language: string) => void;
  toggleTranslation: () => void;
}

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      user: null,
      currentStory: process.env.NODE_ENV === 'development' ? {
        ...mockStory,
        audio_url: mockStory.audio ? URL.createObjectURL(
          new Blob(
            [Uint8Array.from(atob(mockStory.audio), c => c.charCodeAt(0))],
            { type: 'audio/mp3' }
          )
        ) : null,
        showTranslation: false
      } : null,
      recordings: [],
      isRecording: false,
      isDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
      mediaRecorder: null,
      isLoading: false,
      error: null,
      nativeLanguage: null,
      hasSelectedLanguage: false,
      setUser: (user) => set({ user }),
      setCurrentStory: (story) => set({ currentStory: story }),
      setRecordings: (recordings) => set({ recordings }),
      setIsRecording: (isRecording) => set({ isRecording }),
      setIsDarkMode: (isDarkMode) => set({ isDarkMode }),
      setMediaRecorder: (mediaRecorder) => set({ mediaRecorder }),
      generateNewStory: async (language = DEFAULT_TARGET_LANGUAGE, level = 'intermediate') => {
        try {
          const { nativeLanguage } = get();
          set({ isLoading: true, error: null });
          const story = await generateStory(language, level, nativeLanguage);
          set({ 
            currentStory: {
              ...story,
              showTranslation: false
            }
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to generate story';
          set({ error: errorMessage });
          console.error('Story generation error:', error);
        } finally {
          set({ isLoading: false });
        }
      },
      clearError: () => set({ error: null }),
      setNativeLanguage: (language) => set({ 
        nativeLanguage: language,
        hasSelectedLanguage: true
      }),
      toggleTranslation: () => {
        const { currentStory } = get();
        if (!currentStory?.translation) return;
        
        set({ 
          currentStory: { 
            ...currentStory,
            showTranslation: !currentStory.showTranslation
          } 
        });
      }
    }),
    {
      name: 'language-learning-storage',
      partialize: (state) => ({
        isDarkMode: state.isDarkMode,
        nativeLanguage: state.nativeLanguage,
        hasSelectedLanguage: state.hasSelectedLanguage
      })
    }
  )
);