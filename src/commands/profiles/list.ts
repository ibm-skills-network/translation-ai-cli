import {Command} from '@oclif/core'

import {listProfiles} from '../../lib/profile/storage.js'

export default class ProfilesList extends Command {
  static description = 'List all profiles'
  static examples = ['<%= config.bin %> <%= command.id %>']

  async run(): Promise<void> {
    const profiles = listProfiles()

    if (profiles.length === 0) {
      this.log('No profiles found')
      return
    }

    for (const profile of profiles) {
      this.log(profile)
    }
  }
}
