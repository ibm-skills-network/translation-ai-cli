import { SystemMessage, HumanMessage, BaseMessage } from '@langchain/core/messages';
import type { BaseChatModel } from '@langchain/core/language_models/chat_models';
import type { TranslationOptions } from '../types.js';

/**
 * Translates markdown content using a chat model
 */
export class MarkdownTranslator {
  constructor(private chatModel: BaseChatModel) {}

  /**
   * Translates markdown content from source language to target language
   */
  async translate(options: TranslationOptions): Promise<string> {
    const response = await this.chatModel.invoke(this.buildMessages(options));
    const translatedContent = response.content as string;

    return translatedContent;
  }

  /**
   * Streams translated markdown content from source language to target language
   */
  async *translateStream(options: TranslationOptions): AsyncGenerator<string> {
    const stream = await this.chatModel.stream(this.buildMessages(options));

    for await (const chunk of stream) {
      const content = chunk.content;
      if (typeof content === 'string') {
        yield content;
      }
    }
  }

  /**
   * Creates the system prompt for translation
   */
  private createSystemPrompt(
    sourceLanguage: string,
    targetLanguage: string
  ): string {
    return `You are a helpful assistant that accurately translates markdown document snippets from ${sourceLanguage} to ${targetLanguage} while preserving markdown syntax, formatting, and custom directives.
You always preserve the structure and formatting exactly as it is.
You do not add, alter or modify the text you receive in any way.

Reminder:
- Translate only the text, preserving the structure and formatting.
- NEVER under any circumstances translate any words found inside backticks Eg. \`Text\`.
- NEVER translate custom directive like ::startApplication{...} or ::openFile{...}.
- DO translate titles inside the ::page{title=""} custom directive.
- NEVER translate keywords that appear after colons, such as \`:fa-lightbulb-o:\`.
- NEVER translate the sections "Author", "Other Contributors", and "Change Logs".
- NEVER translate any URLs.
- NEVER translate HTML tags like \`<details>\` and \`<summary>\`.
- Translate idiomatically, adapting expressions to sound natural in ${targetLanguage}.
- Avoid overly literal translations; prioritize clarity and fluency in ${targetLanguage} over word-for-word accuracy.
- Use concise and clear language that would sound natural in everyday speech or written ${targetLanguage}.
- When technical ${sourceLanguage} terms lack a common ${targetLanguage} equivalent, use well-known ${targetLanguage} alternatives or rephrase for clarity.
- Be consistent with technical terms. If an equivalent technical term is not available in ${targetLanguage}, always use the original term.

*IMPORTANT*
Translate without any additional information or comments.`;
  }

  private buildMessages({ sourceLanguage, targetLanguage, content }: TranslationOptions): BaseMessage[] {
    const systemPrompt = this.createSystemPrompt(sourceLanguage, targetLanguage);
    const messages = [new SystemMessage(systemPrompt), new HumanMessage(content)];

    return messages;
  }
}
