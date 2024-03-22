import { Command, Help } from '@oclif/core'
import { SINGLE_COMMAND_CLI_SYMBOL } from '@oclif/core/lib/symbols'
import { Config } from '@oclif/core/lib/interfaces'

export default class CustomHelp extends Help {
  async showHelp(argv: string[]): Promise<void> {
    const originalArgv = argv.slice(1)
    argv = argv.filter(
      (arg) => !getHelpFlagAdditions(this.config).includes(arg)
    )
    const subject = getHelpSubject(argv, this.config)
    console.log(originalArgv, argv, subject)
    // Figure out what to print, rootHelp or commandHelp

    if (!subject) {
      if (this.config.isSingleCommandCLI) {
        const roodCmd = this.config.findCommand(SINGLE_COMMAND_CLI_SYMBOL)
        if (roodCmd) {
          await this.showCommandHelp(roodCmd)
        }
      }

      await this.showRootHelp()
      return
    }

    const command = this.config.findCommand(subject)
    if (command) {
      if (command.id === SINGLE_COMMAND_CLI_SYMBOL) {
        command.id = ''
      }
      await this.showCommandHelp(command)
    }
  }

  async showCommandHelp(command: Command.Loadable): Promise<void> {
    console.log(command.id)
  }

  protected async showRootHelp(): Promise<void> {
    this.log('Root help')
  }
}

function getHelpFlagAdditions(config: Config) {
  const helpFlags = ['--help']
  const additionalHelpFlags = config.pjson.oclif.additionalHelpFlags ?? []
  return [...new Set([...helpFlags, ...additionalHelpFlags]).values()]
}

function getHelpSubject(args: string[], config: Config): string | undefined {
  const mergedHelpFlags = getHelpFlagAdditions(config)
  for (const arg of args) {
    if (arg === '--') return
    if (mergedHelpFlags.includes(arg) || arg === 'help') continue
    if (arg.startsWith('-')) return
    return arg
  }
}
