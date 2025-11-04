/**
 * Represents a chunk of split source text.
 * Each chunk can indicate whether it should be translated or not via shouldTranslate.
 */
export interface Chunk {
  /**
   * The main content of the chunk (trimmed of leading/trailing whitespace)
   */
  content: string

  /**
   * Leading whitespace that was trimmed from the content
   */
  leadingWhitespace?: string

  /**
   * Whether this chunk should be translated
   */
  shouldTranslate: boolean

  /**
   * Trailing whitespace that was trimmed from the content
   */
  trailingWhitespace?: string
}

/**
 * Base interface for content splitters.
 * All splitter implementations must provide these methods.
 */
export interface BaseSplitter {
  /**
   * Reconstructs content by appending a chunk to an accumulator with proper whitespace
   */
  reconstruct(accumulator: string, chunk: Chunk): string

  /**
   * Splits content into chunks
   */
  split(content: string): Promise<Chunk[]>
}

/**
 * Translation configuration options
 */
export interface TranslationOptions {
  /**
   * The markdown content to translate
   */
  content: string

  /**
   * Source language (e.g., "EN", "ES")
   */
  sourceLanguage: string

  /**
   * Target language (e.g., "EN", "ES")
   */
  targetLanguage: string
}
