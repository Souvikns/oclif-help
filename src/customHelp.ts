import { Command, Help } from '@oclif/core'

export default class CustomHelp extends Help {
  async showHelp(argv: string[]): Promise<void> {
    const originalArgv = argv.slice(1)
    console.log(originalArgv)
    this.showRootHelp()
  }

  async showCommandHelp(command: Command.Loadable): Promise<void> {}

  protected async showRootHelp(): Promise<void> {
    this.log('Root help')
  }
}
