import {Args, Command, Flags} from '@oclif/core'

import {createClient} from '../core/providers/watsonx.js'
import {MarkdownTranslator} from '../core/translators/markdown.js'

export default class Markdown extends Command {
  static args = {
    input: Args.string({
      description: 'The markdown text you want to translate',
      required: false,
    }),
  }
  static description = 'Translate markdown'
  static examples = [
    '<%= config.bin %> <%= command.id %> --from EN --to ES "Hello"',
    '<%= config.bin %> <%= command.id %> --from EN --to ES --stream "Hello"',
    'cat doc.md | <%= config.bin %> <%= command.id %> --from EN --to ES',
    'echo "# Hello" | <%= config.bin %> <%= command.id %> --from EN --to ES',
  ]
  static flags = {
    from: Flags.string({
      description: 'Source language',
      required: true,
    }),
    stream: Flags.boolean({
      default: false,
      description: 'Stream the translation output',
    }),
    to: Flags.string({
      description: 'Target language',
      required: true,
    }),
  }

  async run(): Promise<void> {
    const {args, flags} = await this.parse(Markdown)

    let input: string

    if (args.input) {
      input = args.input
    } else {
      const chunks: Buffer[] = []
      for await (const chunk of process.stdin) {
        chunks.push(chunk)
      }

      input = Buffer.concat(chunks).toString('utf8')
    }

    const llm = createClient()
    const translator = new MarkdownTranslator(llm)

    if (flags.stream) {
      for await (const chunk of translator.translateStream({
        content: input,
        sourceLanguage: flags.from,
        targetLanguage: flags.to,
      })) {
        process.stdout.write(chunk)
      }

      process.stdout.write('\n')
    } else {
      const result = await translator.translate({
        content: input,
        sourceLanguage: flags.from,
        targetLanguage: flags.to,
      })

      this.log(result)
    }
  }
}
