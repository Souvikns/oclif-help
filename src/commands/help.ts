import {
  Command,
  loadHelpClass,
  Args,
  Flags,
} from '@oclif/core'

export default class HelpCommand extends Command {
  static args = {
    command: Args.string({
      description: 'Command to show help for.',
      required: false,
    }),
  }

  static description = 'Display help for <%= config.bin %>.'

  static flags = {
    'nested-commands': Flags.boolean({
      char: 'n',
      description: 'Include all nested commands in the output.',
    }),
  }

  static strict = false

  async run(): Promise<any> {
    const { flags, argv } = await this.parse(HelpCommand)
    const Help = await loadHelpClass(this.config)
    const help = new Help(this.config, { all: flags['nested-commands'] })
    await help.showHelp(argv as string[])
  }
}
