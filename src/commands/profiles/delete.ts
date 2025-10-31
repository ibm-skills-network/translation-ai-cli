import {Args, Command} from '@oclif/core'

import {deleteProfile} from '../../lib/profile/storage.js'

export default class ProfilesDelete extends Command {
  static args = {
    name: Args.string({
      description: 'Profile name to delete',
      required: true,
    }),
  }
  static description = 'Delete a profile'
  static examples = ['<%= config.bin %> <%= command.id %> my-profile']

  async run(): Promise<void> {
    const {args} = await this.parse(ProfilesDelete)

    try {
      deleteProfile(args.name)
      this.log(`Profile "${args.name}" deleted successfully`)
    } catch (error) {
      if (error instanceof Error) {
        this.error(error.message)
      }

      throw error
    }
  }
}
