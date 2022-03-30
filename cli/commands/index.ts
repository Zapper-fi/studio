import { Command } from '@oclif/core';

import CreateAppCommand from './create-app';
import GenerateContractFactory from './generate-contract-factory';
import HelloCommand from './hello';
import NewCommand from './new-command';
import PotatoCommand from './potato';

/**
 * Record of invocation string and the associated command.
 * Simply add a command implementation here with the desired command name and it'll
 * be automatically added to the root CLI
 */
export const commands: Record<string, typeof Command> = {
  hello: HelloCommand,
  potato: PotatoCommand,
  'create:command': NewCommand,
  'generate:contract-factory': GenerateContractFactory,
  'create-app': CreateAppCommand,
};
