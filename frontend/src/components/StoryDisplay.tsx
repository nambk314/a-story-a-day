import React, { useEffect } from 'react';
import { AudioRecorder } from './AudioRecorder';
import { useStore } from '../store/useStore';
import { AlertCircle, Loader2, Languages } from 'lucide-react';
import { getLanguageName } from '../constants/languages';
import { StoryAudioPlayer } from './StoryAudioPlayer';

export const StoryDisplay: React.FC = () => {
  const { 
    currentStory, 
    isLoading, 
    error, 
    generateNewStory, 
    clearError,
    nativeLanguage,
    toggleTranslation
  } = useStore();

  useEffect(() => {
    if (!currentStory && !isLoading && !error && nativeLanguage) {
      generateNewStory();
    }
  }, [currentStory, isLoading, error, generateNewStory, nativeLanguage]);

  if (!nativeLanguage) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-2">Please select your native language first</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">A story will be generated automatically after selection</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
        <p className="text-gray-500 dark:text-gray-400">Generating your story...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 max-w-md">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Story Generation Failed
              </h3>
              <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => {
                    clearError();
                    generateNewStory();
                  }}
                  className="rounded-md bg-yellow-50 dark:bg-yellow-900 px-3 py-2 text-sm font-medium text-yellow-800 dark:text-yellow-300 hover:bg-yellow-100 dark:hover:bg-yellow-800 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentStory) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 dark:text-gray-400">No story available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{currentStory.title}</h2>
      <div className="prose dark:prose-invert max-w-none space-y-4">
        <div className="space-y-2">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {currentStory.content}
          </p>
          {nativeLanguage && currentStory.translation && (
            <button
              onClick={toggleTranslation}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
              <Languages size={16} />
              <span>
                {currentStory.showTranslation 
                  ? 'Hide Translation' 
                  : `Translate to ${getLanguageName(nativeLanguage)}`}
              </span>
            </button>
          )}
          {currentStory.showTranslation && currentStory.translation && (
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed border-l-4 border-blue-500 pl-4">
              {currentStory.translation}
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Listen to the story
          </h3>
          <StoryAudioPlayer audio={currentStory.audio || undefined} />
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Record your voice, be sure to be in a quiet place to get the best score for your speech
          </h3>
          <AudioRecorder />
        </div>
      </div>
    </div>
  );
};