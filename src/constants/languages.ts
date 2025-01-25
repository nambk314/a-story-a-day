export const SUPPORTED_LANGUAGES = [
  {
    code: 'vi',
    name: 'Vietnamese',
    nativeName: 'Tiếng Việt'
  },
  // Add more languages here as needed
] as const;

export const DEFAULT_TARGET_LANGUAGE = 'en';

export function getLanguageName(code: string): string {
  const language = SUPPORTED_LANGUAGES.find(lang => lang.code === code);
  return language?.nativeName || language?.name || code;
}