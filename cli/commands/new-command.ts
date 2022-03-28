import * as fs from 'fs';
import { Command } from '@oclif/core';
import dedent from 'dedent';
import chalk from 'chalk';

import { strings } from '../strings';

export default class NewCommand extends Command {
  static description = 'Create a new command';

  static hidden = true;

  static examples = [];

  static flags = {};

  static args = [{ name: 'command', description: 'Name of the command (in kebab-case please!)', required: true }];

  async run(): Promise<void> {
    const { args } = await this.parse(NewCommand);
    const command = args.command;

    try {
      fs.writeFileSync(
        `cli/commands/${command}.ts`,
        dedent`
      import { Command } from '@oclif/core';

      export default class ${strings.titleCase(command)} extends Command { 
        static description = '';
        static examples = [];
        static flags = {};
        static args = [];

        async run(): Promise<void> {
          const { args } = await this.parse(${strings.titleCase(command)});
        }
      }
    `,
      );
      this.log(
        strings.lines([
          `Created new command in "cli/commands/${command}.ts`,
          `${chalk.bold('Note:')} Don't forget to add it to the run.ts file.`,
        ]),
      );
    } catch (e) {
      this.error(e.message);
    }
  }
}
