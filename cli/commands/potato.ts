import { Command } from '@oclif/core';

import { appPath } from '../utils/app-path';

export default class Potato extends Command {
  static description = 'Potato';

  static examples = [`$ ./agora potato my-app`];

  static flags = {};

  static args = [{ name: 'appid', description: 'The application folder id', required: true }];

  async run(): Promise<void> {
    const { args } = await this.parse(Potato);
    this.log(appPath(args.appid));
  }
}
