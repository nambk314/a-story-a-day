import React, { useEffect } from 'react';
import { StoryDisplay } from './components/StoryDisplay';
import { LanguageModal } from './components/LanguageModal';
import { BookOpen, Moon, Sun, Globe2 } from 'lucide-react';
import { useStore } from './store/useStore';
import { getLanguageName } from './constants/languages';

function App() {
  const { 
    isDarkMode, 
    setIsDarkMode, 
    nativeLanguage,
    hasSelectedLanguage
  } = useStore();

  const [showLanguageModal, setShowLanguageModal] = React.useState(!hasSelectedLanguage);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-blue-500 dark:text-blue-400" />
                <h1 className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                  Language Learning App
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowLanguageModal(true)}
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  <Globe2 size={20} />
                  <span>{nativeLanguage ? getLanguageName(nativeLanguage) : 'Select Language'}</span>
                </button>
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label="Toggle dark mode"
                >
                  {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <nav className="flex items-center space-x-2 sm:space-x-4">
                  <button className="px-3 py-2 sm:px-4 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                    Sign In
                  </button>
                  <button className="px-3 py-2 sm:px-4 text-sm font-medium text-white bg-blue-500 dark:bg-blue-600 rounded-md hover:bg-blue-600 dark:hover:bg-blue-700">
                    Sign Up
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6">
            <StoryDisplay />
          </div>
        </main>
      </div>

      <LanguageModal 
        isOpen={showLanguageModal} 
        onClose={() => setShowLanguageModal(false)} 
      />
    </div>
  );
}

export default App;