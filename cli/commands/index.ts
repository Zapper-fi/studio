import { Command } from '@oclif/core';

import ClearCache from './clear-cache';
import CreateApp from './create-app';
import CreateContractPositionFetcher from './create-contract-position-fetcher';
import CreateAppTokenFetcher from './create-app-token-fetcher';
import GenerateContractFactory from './generate-contract-factory';
import SetNetworkProvider from './set-network-provider';

/**
 * Record of invocation string and the associated command.
 * Simply add a command implementation here with the desired command name and it'll
 * be automatically added to the root CLI
 */
export const commands: Record<string, typeof Command> = {
  'generate:contract-factory': GenerateContractFactory,
  'create-app': CreateApp,
  'create-token-fetcher': CreateAppTokenFetcher,
  'create-contract-position-fetcher': CreateContractPositionFetcher,
  'clear-cache': ClearCache,
  'set-network-provider': SetNetworkProvider,
};
