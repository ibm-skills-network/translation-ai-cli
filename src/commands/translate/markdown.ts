import {BaseChatModel} from '@langchain/core/language_models/chat_models'

import {MARKDOWN_SYSTEM_PROMPT} from '../../core/prompts/markdown.js'
import {MarkdownSplitter} from '../../core/splitters/markdown.js'
import {Translator} from '../../core/translators/translator.js'
import {BaseTranslateCommand} from './base.js'

export default class TranslateMarkdown extends BaseTranslateCommand<typeof TranslateMarkdown> {
  static args = {
    ...BaseTranslateCommand.args,
  }
  static description = 'Translate markdown'
  static examples = [
    '<%= config.bin %> <%= command.id %> --profile default-openai --from EN --to ES "Hello"',
    '<%= config.bin %> <%= command.id %> --profile default-openai --from EN --to ES --stream "Hello"',
    'cat doc.md | <%= config.bin %> <%= command.id %> --profile default-openai --from EN --to ES',
    'echo "# Hello" | <%= config.bin %> <%= command.id %> --profile default-openai --from EN --to ES',
  ]
  static flags = {
    ...BaseTranslateCommand.baseFlags,
  }

  createTranslator(llm: BaseChatModel): Translator {
    return new Translator(llm, new MarkdownSplitter(), MARKDOWN_SYSTEM_PROMPT)
  }
}
