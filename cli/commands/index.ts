import { Command } from '@oclif/core';

import ClearCache from './clear-cache';
import CodegenApp from './codegen-app';
import CreateAppCommand from './create-app';
import CreateTokenFetcher from './create-token-fetcher';
import GenerateContractFactory from './generate-contract-factory';
import SetNetworkProvider from './set-network-provider';

/**
 * Record of invocation string and the associated command.
 * Simply add a command implementation here with the desired command name and it'll
 * be automatically added to the root CLI
 */
export const commands: Record<string, typeof Command> = {
  'generate:contract-factory': GenerateContractFactory,
  'create-app': CreateAppCommand,
  'codegen-app': CodegenApp,
  'create-token-fetcher': CreateTokenFetcher,
  'clear-cache': ClearCache,
  'set-network-provider': SetNetworkProvider,
};
