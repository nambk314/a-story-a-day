import React from 'react';
import { useStore } from '../store/useStore';
import { SUPPORTED_LANGUAGES } from '../constants/languages';
import { Globe2 } from 'lucide-react';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({ isOpen, onClose }) => {
  const { setNativeLanguage } = useStore();

  if (!isOpen) return null;

  const handleLanguageSelect = (languageCode: string) => {
    setNativeLanguage(languageCode);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <Globe2 className="h-6 w-6 text-blue-500" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Choose Your Native Language
          </h2>
        </div>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Select your native language to see translations while learning English
        </p>

        <div className="grid gap-3">
          {SUPPORTED_LANGUAGES.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageSelect(language.code)}
              className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="text-gray-900 dark:text-white font-medium">
                {language.nativeName}
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                {language.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};