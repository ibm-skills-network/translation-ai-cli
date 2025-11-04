import {BaseChatModel} from '@langchain/core/language_models/chat_models'
import {Args, Command, Flags, Interfaces} from '@oclif/core'

import {Translator} from '../../core/translators/translator.js'
import {createProviderFromProfile} from '../../lib/profile/factory.js'
import {loadProfile} from '../../lib/profile/storage.js'

type TranslateFlags<T extends typeof Command> = Interfaces.InferredFlags<
  T['flags'] & typeof BaseTranslateCommand.baseFlags
>
type TranslateArgs<T extends typeof Command> = Interfaces.InferredArgs<T['args']>

export abstract class BaseTranslateCommand<T extends typeof Command> extends Command {
  static args = {
    input: Args.string({
      description: 'The text you want to translate',
      required: false,
    }),
  }
  static baseFlags = {
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
  protected args!: TranslateArgs<T>
  protected flags!: TranslateFlags<T>

  abstract createTranslator(llm: BaseChatModel): Translator

  public async init(): Promise<void> {
    await super.init()
    const {args, flags} = await this.parse({
      args: this.ctor.args,
      baseFlags: (super.ctor as typeof BaseTranslateCommand).baseFlags,
      flags: this.ctor.flags,
      strict: this.ctor.strict,
    })
    this.flags = flags as TranslateFlags<T>
    this.args = args as TranslateArgs<T>
  }

  async run(): Promise<void> {
    let input: string

    if (this.args.input) {
      input = this.args.input
    } else {
      const chunks: Buffer[] = []
      for await (const chunk of process.stdin) {
        chunks.push(chunk)
      }

      input = Buffer.concat(chunks).toString('utf8')
    }

    const llm = createProviderFromProfile(loadProfile(this.flags.profile))
    const translator = this.createTranslator(llm)

    if (this.flags.stream) {
      for await (const chunk of translator.translateStream({
        content: input,
        sourceLanguage: this.flags.from,
        targetLanguage: this.flags.to,
      })) {
        process.stdout.write(chunk)
      }
    } else {
      const result = await translator.translate({
        content: input,
        sourceLanguage: this.flags.from,
        targetLanguage: this.flags.to,
      })

      process.stdout.write(result)
    }
  }
}
