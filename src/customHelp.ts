import { Command, Help } from '@oclif/core'
import { SINGLE_COMMAND_CLI_SYMBOL } from '@oclif/core/lib/symbols'
import { Config, Topic } from '@oclif/core/lib/interfaces'
import { colorize } from '@oclif/core/lib/cli-ux'

export default class CustomHelp extends Help {
  async showHelp(argv: string[]): Promise<void> {
    const originalArgv = argv.slice(1)
    argv = argv.filter(
      (arg) => !getHelpFlagAdditions(this.config).includes(arg)
    )
    const subject = getHelpSubject(argv, this.config)
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

  async showRootHelp(): Promise<void> {
    let rootTopics = this.sortedTopics
    let rootCommands = this.sortedCommands

    const state = this.config.pjson?.oclif?.state
    if (state) {
      this.log(
        state === 'deprecated'
          ? `${this.config.bin} is deprecated`
          : `${this.config.bin} is in ${state}.\n`
      )
    }

    this.log(this.formatRoot())
    this.log('')

    if (!this.opts.all) {
      rootTopics = rootTopics.filter((t) => !t.name.includes(':'))
      rootCommands = rootCommands.filter((c) => !c.id.includes(':'))
    }

    // if (rootTopics.length > 0) {
    //   this.log(this.formatTopics(rootTopics))
    //   this.log('')
    // }

    if (rootCommands.length > 0 && rootTopics.length > 0) {
      rootCommands = rootCommands.filter((c) => c.id)
      this.log(this.formatCommandsAndTopics(rootCommands, rootTopics))
      this.log('')
    }
  }

  protected formatCommandsAndTopics(
    commands: Command.Loadable[],
    topics: Topic[]
  ): string {
    if (commands.length === 0 && topics.length === 0) return ''

    let body = this.renderList(
      commands
        .filter((c) =>
          this.opts.hideAliasesFromRoot ? !c.aliases?.includes(c.id) : true
        )
        .map((c) => {
          if (this.config.topicSeparator !== ':')
            c.id.replaceAll(':', this.config.topicSeparator)
          const summary = this.summary(c)
          return [colorize('magenta', c.id), summary]
        })
        .concat(
          topics.map((c) => {
            if (this.config.topicSeparator !== ':')
              c.name = c.name.replaceAll(':', this.config.topicSeparator)
            return [
              colorize(this.config?.theme?.topic || 'cyan', c.name),
              c.description &&
                this.render(
                  colorize(
                    this.config?.theme?.sectionDescription,
                    c.description.split('\n')[0]
                  )
                ),
            ]
          })
        ),
      { indentation: 2, spacer: '\n', stripAnsi: this.opts.stripAnsi }
    )

    return this.section(colorize('cyan', 'COMMANDS'), body)
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
