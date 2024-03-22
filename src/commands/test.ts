import { Command } from '@oclif/core'

export default class TestCommand extends Command {
  static description: string | undefined = 'A Test Command'

  async run(): Promise<any> {
    console.log('Test Command')
  }
}
