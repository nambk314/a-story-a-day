export interface User {
  id: string;
  email: string;
  target_language: string;
  interface_language: string;
  created_at: string;
}

export interface Story {
  id: string;
  title: string;
  content: string;
  translation: string;
  language: string;
  level: string;
  audio: string | null;
  created_at: string;
  showTranslation?: boolean;
}

export interface Recording {
  id: string;
  user_id: string;
  story_id: string;
  audio_url: string;
  score: number;
  feedback: WordFeedback[];
  created_at: string;
}

export interface WordFeedback {
  word: string;
  audio: string;
  translation?: string;
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
}