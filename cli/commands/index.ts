import { Command } from '@oclif/core';

import HelloCommand from './hello';
import PotatoCommand from './potato';
import NewCommand from './new-command';

/**
 * Record of invocation string and the associated command.
 * Simply add a command implementation here with the desired command name and it'll
 * be automatically added to the root CLI
 */
export const commands: Record<string, typeof Command> = {
  hello: HelloCommand,
  potato: PotatoCommand,
  'create:command': NewCommand,
};
