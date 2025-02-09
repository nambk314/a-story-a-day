import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Trash2, Send, AlertCircle } from 'lucide-react';
import { AudioProgressBar } from './AudioProgressBar';

interface RecordingAudioPlayerProps {
  audioUrl: string;
  onDelete?: () => void;
  onSubmit?: () => void;
}

export const RecordingAudioPlayer: React.FC<RecordingAudioPlayerProps> = ({ 
  audioUrl, 
  onDelete, 
  onSubmit 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      const handleLoadedMetadata = () => {
        console.log('Recording metadata loaded:', audioRef.current?.duration);
        setAudioElement(audioRef.current);
      };

      audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
      
      // For Safari and some browsers, metadata might already be loaded
      if (audioRef.current.readyState >= 2) {
        console.log('Recording metadata already loaded:', audioRef.current.duration);
        setAudioElement(audioRef.current);
      }

      return () => {
        audioRef.current?.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }
  }, [audioUrl]); // Re-run when audioUrl changes

  const togglePlayback = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        await audioRef.current.pause();
      } else {
        setError(null);
        await audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error('Playback error:', error);
      setIsPlaying(false);
      setError('Unable to play audio. Please try again.');
    }
  };

  const handleEnded = () => setIsPlaying(false);
  const handleError = () => {
    setError('Failed to load audio. Please try again.');
    setIsPlaying(false);
  };

  if (error) {
    return (
      <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg text-yellow-800 dark:text-yellow-200">
        <AlertCircle className="h-5 w-5 text-yellow-400" />
        <span className="text-sm">{error}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 w-full max-w-md">
      <div className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <button
          onClick={togglePlayback}
          className="p-2 rounded-full bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white transition-colors"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
        
        <audio 
          ref={audioRef}
          src={audioUrl}
          onEnded={handleEnded}
          onError={handleError}
          preload="metadata"
        />
        
        {audioElement && (
          <AudioProgressBar 
            audio={audioElement} 
            isPlaying={isPlaying}
          />
        )}

        {onDelete && (
          <button
            onClick={onDelete}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
          >
            <Trash2 size={20} />
          </button>
        )}

        {onSubmit && (
          <button
            onClick={onSubmit}
            className="p-2 rounded-full bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700 text-white transition-colors"
          >
            <Send size={20} />
          </button>
        )}
      </div>
    </div>
  );
}; 