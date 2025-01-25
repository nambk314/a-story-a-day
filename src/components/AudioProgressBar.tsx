import React, { useEffect, useState, useCallback } from 'react';

interface AudioProgressBarProps {
  audio: HTMLAudioElement;
  isPlaying: boolean;
}

export const AudioProgressBar: React.FC<AudioProgressBarProps> = ({ audio, isPlaying }) => {
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const updateProgress = useCallback(() => {
    if (audio) {
      setProgress(audio.currentTime);
    }
  }, [audio]);

  useEffect(() => {
    const handleLoadedMetadata = () => {
      console.log('Metadata loaded, duration:', audio.duration);
      setDuration(audio.duration);
      setProgress(0);
    };

    const handleDurationChange = () => {
      console.log('Duration changed:', audio.duration);
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      updateProgress();
    };

    const handleEnded = () => {
      setProgress(0);
    };

    // If the audio is already loaded, set the duration immediately
    if (audio.readyState >= 1) {
      setDuration(audio.duration);
    }

    // Update progress more frequently when playing
    let progressInterval: number | null = null;
    if (isPlaying) {
      progressInterval = window.setInterval(updateProgress, 50);
    }

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('pause', updateProgress);
    audio.addEventListener('play', updateProgress);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('pause', updateProgress);
      audio.removeEventListener('play', updateProgress);
      if (progressInterval) {
        clearInterval(progressInterval);
      }
    };
  }, [audio, isPlaying, updateProgress]);

  const formatTime = (time: number) => {
    if (!isFinite(time) || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (isFinite(newTime) && !isNaN(newTime)) {
      audio.currentTime = newTime;
      setProgress(newTime);
    }
  };

  return (
    <div className="flex items-center gap-2 w-full max-w-md">
      <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[40px] tabular-nums">
        {formatTime(progress)}
      </span>
      <input
        type="range"
        min={0}
        max={duration || 0}
        value={progress}
        onChange={handleSeek}
        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500 dark:accent-blue-400"
        style={{
          background: duration > 0 ? `linear-gradient(to right, 
            rgb(59, 130, 246) 0%, 
            rgb(59, 130, 246) ${(progress / duration) * 100}%, 
            rgb(229, 231, 235) ${(progress / duration) * 100}%, 
            rgb(229, 231, 235) 100%)` : undefined
        }}
      />
      <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[40px] tabular-nums">
        {formatTime(duration)}
      </span>
    </div>
  );
};