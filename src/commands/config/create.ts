import {Command, Flags} from '@oclif/core'

export default class CreateConfigClass extends Command {
    static description: string | undefined = 'create config'
    static flags = {
        'new': Flags.string({
            char: 'n',
            description: 'new config'
        })
    }
    run(): Promise<any> {
        throw new Error('Method not implemented.');
    }
}