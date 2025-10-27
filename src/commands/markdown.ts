import {Args, Command, Flags} from '@oclif/core'

export default class Markdown extends Command {
  static description = 'Translate markdown'

  static args = {
    input: Args.string({
      description: 'Input (use @filename for file, or omit for stdin)',
      required: false,
    }),
  }

  static examples = [
    'cat doc.md | <%= config.bin %> <%= command.id %> --from English --to Spanish',
    'echo "# Hello" | <%= config.bin %> <%= command.id %> --from en --to es',
  ]

  static flags = {
    from: Flags.string({
      description: 'Source language',
      required: true,
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
      input = Buffer.concat(chunks).toString('utf-8')
    }

    // TODO: invoke a markdown translator with provided inputs
  }
}
