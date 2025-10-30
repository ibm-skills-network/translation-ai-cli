/**
 * Represents a chunk of split source text.
 * Each chunk can indicate whether it should be translated or not via shouldTranslate.
 */
export interface Chunk {
  content: string;
  shouldTranslate: boolean;
}

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
