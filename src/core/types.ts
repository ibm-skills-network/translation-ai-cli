/**
 * Translation configuration options
 */
export interface TranslationOptions {
  /**
   * The markdown content to translate
   */
  content: string;

  /**
   * Source language (e.g., "EN", "ES")
   */
  sourceLanguage: string;

  /**
   * Target language (e.g., "EN", "ES")
   */
  targetLanguage: string;
}
