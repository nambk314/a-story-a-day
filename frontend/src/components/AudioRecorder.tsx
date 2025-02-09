import React, { useState } from 'react';
import { Mic, Square, Settings } from 'lucide-react';
import { useReactMediaRecorder } from 'react-media-recorder';
import { useStore } from '../store/useStore';
import { evaluatePronunciation } from '../services/api';
import { PronunciationFeedback } from './PronunciationFeedback';
import { WordFeedback } from '../types';
import { RecordingAudioPlayer } from './RecordingAudioPlayer';

interface EvaluationResult {
  overall_score: number;
  feedback: WordFeedback[];
}

export const AudioRecorder: React.FC = () => {
  const { currentStory, nativeLanguage } = useStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedAudioUrl, setProcessedAudioUrl] = useState<string | null>(null);

  const {
    status,
    startRecording,
    stopRecording,
    mediaBlobUrl,
    clearBlobUrl
  } = useReactMediaRecorder({
    audio: true,
    mediaRecorderOptions: {
      mimeType: 'audio/webm;codecs=opus'
    },
    onStop: async (blobUrl) => {
      setIsProcessing(true);
      try {
        // Create a new audio element to load the blob
        const audio = new Audio(blobUrl);
        await new Promise((resolve, reject) => {
          audio.addEventListener('loadedmetadata', resolve);
          audio.addEventListener('error', reject);
          audio.load();
        });
        setProcessedAudioUrl(blobUrl);
      } catch (error) {
        console.error('Error processing audio:', error);
      } finally {
        setIsProcessing(false);
      }
    },
    onError: (error) => {
      console.error('Recording error:', error);
      if (error.name === 'NotAllowedError') {
        setPermissionError('Microphone access was denied. Please allow microphone access in your browser settings to record audio.');
      } else if (error.name === 'NotFoundError') {
        setPermissionError('No microphone found. Please connect a microphone and try again.');
      } else {
        setPermissionError('An error occurred while accessing the microphone. Please try again.');
      }
    }
  });

  const isRecording = status === 'recording';
  const hasRecording = status === 'stopped' && processedAudioUrl;

  const handleSubmit = async () => {
    if (!mediaBlobUrl || !currentStory) return;

    try {
      setIsSubmitting(true);
      const response = await fetch(mediaBlobUrl);
      const blob = await response.blob();
      const result = await evaluatePronunciation(
        currentStory.content, 
        blob, 
        nativeLanguage || undefined
      );
      setEvaluationResult(result);
    } catch (error) {
      console.error('Error submitting recording:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePlayWord = async (word: string, audioContent: string) => {
    try {
      // Create audio blob from base64 content
      const audioBlob = new Blob(
        [Uint8Array.from(atob(audioContent), c => c.charCodeAt(0))],
        { type: 'audio/mp3' }
      );
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      await audio.play();
      
      // Clean up the URL after playback
      audio.onended = () => URL.revokeObjectURL(audioUrl);
    } catch (error) {
      console.error('Error playing word pronunciation:', error);
    }
  };

  const openBrowserSettings = () => {
    if (navigator.userAgent.includes('Chrome')) {
      window.open('chrome://settings/content/microphone');
    } else if (navigator.userAgent.includes('Firefox')) {
      window.open('about:preferences#privacy');
    } else {
      window.open('about:settings');
    }
  };

  return (
    <div className="space-y-4 w-full max-w-md">
      {permissionError ? (
        <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Settings className="h-5 w-5 text-yellow-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Microphone Access Required
              </h3>
              <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                <p>{permissionError}</p>
              </div>
              <div className="mt-4">
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={openBrowserSettings}
                    className="rounded-md bg-yellow-50 dark:bg-yellow-900 px-3 py-2 text-sm font-medium text-yellow-800 dark:text-yellow-300 hover:bg-yellow-100 dark:hover:bg-yellow-800 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                  >
                    Open Browser Settings
                  </button>
                  <button
                    type="button"
                    onClick={() => setPermissionError(null)}
                    className="rounded-md bg-yellow-50 dark:bg-yellow-900 px-3 py-2 text-sm font-medium text-yellow-800 dark:text-yellow-300 hover:bg-yellow-100 dark:hover:bg-yellow-800 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {!hasRecording ? (
            <div className="flex items-center gap-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg w-full">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`p-2 rounded-full transition-colors ${
                  isRecording 
                    ? 'bg-red-500 dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-700' 
                    : 'bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700'
                } text-white`}
                disabled={isSubmitting || isProcessing}
              >
                {isRecording ? <Square size={20} /> : <Mic size={20} />}
              </button>
              
              {isRecording && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 dark:bg-red-400 animate-pulse" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Recording...</span>
                </div>
              )}
              
              {isProcessing && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400 animate-pulse" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Processing...</span>
                </div>
              )}
            </div>
          ) : (
            <RecordingAudioPlayer 
              audioUrl={processedAudioUrl}
              onDelete={() => {
                clearBlobUrl();
                setProcessedAudioUrl(null);
                setEvaluationResult(null);
              }}
              onSubmit={handleSubmit}
            />
          )}

          {isSubmitting && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Evaluating pronunciation...
            </p>
          )}

          {evaluationResult && (
            <PronunciationFeedback
              score={evaluationResult.overall_score}
              feedback={evaluationResult.feedback}
              onPlayWord={handlePlayWord}
            />
          )}
        </div>
      )}
    </div>
  );
};