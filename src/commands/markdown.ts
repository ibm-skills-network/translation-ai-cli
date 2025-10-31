import {Args, Command, Flags} from '@oclif/core'

import {MarkdownTranslator} from '../core/translators/markdown.js'
import {createProviderFromProfile} from '../lib/profile/factory.js'
import {loadProfile} from '../lib/profile/storage.js'

export default class Markdown extends Command {
  static args = {
    input: Args.string({
      description: 'The markdown text you want to translate',
      required: false,
    }),
  }
  static description = 'Translate markdown'
  static examples = [
    '<%= config.bin %> <%= command.id %> --profile default-openai --from EN --to ES "Hello"',
    '<%= config.bin %> <%= command.id %> --profile default-openai --from EN --to ES --stream "Hello"',
    'cat doc.md | <%= config.bin %> <%= command.id %> --profile default-openai --from EN --to ES',
    'echo "# Hello" | <%= config.bin %> <%= command.id %> --profile default-openai --from EN --to ES',
  ]
  static flags = {
    from: Flags.string({
      description: 'Source language',
      required: true,
    }),
    profile: Flags.string({
      description: 'Profile to use for translation',
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

    const profile = loadProfile(flags.profile)
    const llm = createProviderFromProfile(profile)
    const translator = new MarkdownTranslator(llm)

    if (flags.stream) {
      for await (const chunk of translator.translateStream({
        content: input,
        sourceLanguage: flags.from,
        targetLanguage: flags.to,
      })) {
        process.stdout.write(chunk)
      }
    } else {
      const result = await translator.translate({
        content: input,
        sourceLanguage: flags.from,
        targetLanguage: flags.to,
      })

      process.stdout.write(result)
    }
  }
}
