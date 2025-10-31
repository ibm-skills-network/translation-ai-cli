import {Args, Command, Flags} from '@oclif/core'

import type {OpenAIProfileConfig, WatsonxProfileConfig} from '../../lib/profile/types.js'

import {saveProfile} from '../../lib/profile/storage.js'

export default class ProfilesSet extends Command {
  static args = {
    name: Args.string({
      description: 'Profile name',
      required: true,
    }),
  }
  static description = 'Create or update a profile'
  static examples = [
    '<%= config.bin %> <%= command.id %> my-openai-profile --provider openai --api-key sk-... --model gpt-4o',
    '<%= config.bin %> <%= command.id %> my-watsonx-profile --provider watsonx --api-key ... --project-id ... --service-url https://... --model ibm/granite-3-8b-instruct',
  ]
  static flags = {
    'api-key': Flags.string({
      description: 'API key for the provider',
      required: true,
    }),
    model: Flags.string({
      description: 'Model to use',
      required: true,
    }),
    'project-id': Flags.string({
      description: 'Watsonx project ID (required for watsonx)',
      required: false,
    }),
    provider: Flags.string({
      description: 'LLM provider',
      options: ['openai', 'watsonx'],
      required: true,
    }),
    'service-url': Flags.string({
      description: 'Watsonx service URL (required for watsonx)',
      required: false,
    }),
  }

  async run(): Promise<void> {
    const {args, flags} = await this.parse(ProfilesSet)

    if (flags.provider === 'openai') {
      const config: OpenAIProfileConfig = {
        apiKey: flags['api-key'],
        model: flags.model,
      }

      saveProfile({
        config,
        name: args.name,
        provider: 'openai',
      })

      this.log(`Profile "${args.name}" saved successfully`)
    } else if (flags.provider === 'watsonx') {
      if (!flags['project-id']) {
        this.error('--project-id is required for watsonx provider')
      }

      if (!flags['service-url']) {
        this.error('--service-url is required for watsonx provider')
      }

      const config: WatsonxProfileConfig = {
        apiKey: flags['api-key'],
        model: flags.model,
        projectId: flags['project-id'],
        serviceUrl: flags['service-url'],
      }

      saveProfile({
        config,
        name: args.name,
        provider: 'watsonx',
      })

      this.log(`Profile "${args.name}" saved successfully`)
    }
  }
}
