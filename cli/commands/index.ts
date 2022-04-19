import { Command } from '@oclif/core';

import CodegenApp from './codegen-app';
import CreateAppCommand from './create-app';
import GenerateContractFactory from './generate-contract-factory';

/**
 * Record of invocation string and the associated command.
 * Simply add a command implementation here with the desired command name and it'll
 * be automatically added to the root CLI
 */
export const commands: Record<string, typeof Command> = {
  'generate:contract-factory': GenerateContractFactory,
  'create-app': CreateAppCommand,
  'codegen-app': CodegenApp,
};
