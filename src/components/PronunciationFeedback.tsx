import React from 'react';
import { Volume2, Languages } from 'lucide-react';
import { WordFeedback } from '../types';
import { useStore } from '../store/useStore';
import { getLanguageName } from '../constants/languages';

interface PronunciationFeedbackProps {
  score: number;
  feedback: WordFeedback[];
  onPlayWord: (word: string, audio: string) => void;
}

export const PronunciationFeedback: React.FC<PronunciationFeedbackProps> = ({
  score,
  feedback,
  onPlayWord,
}) => {
  const { nativeLanguage } = useStore();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Pronunciation Score
        </h3>
        <span className="text-2xl font-bold text-blue-500">
          {score}/100
        </span>
      </div>

      {feedback.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Words to Practice
          </h4>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <ul className="space-y-2">
              {feedback.map(({ word, audio, translation }, index) => (
                <li 
                  key={`${word}-${index}`}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-700 dark:text-gray-300">{word}</span>
                    <button
                      onClick={() => onPlayWord(word, audio)}
                      className="p-1.5 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                      aria-label={`Listen to pronunciation of ${word}`}
                    >
                      <Volume2 size={16} />
                    </button>
                  </div>
                  {translation && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {translation}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};