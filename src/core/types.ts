/**
 * Translation configuration options
 */
export interface TranslationOptions {
  /**
   * Source language (e.g., "EN", "ES")
   */
  sourceLanguage: string;

  /**
   * Target language (e.g., "EN", "ES")
   */
  targetLanguage: string;

  /**
   * The markdown content to translate
   */
  content: string;
}
