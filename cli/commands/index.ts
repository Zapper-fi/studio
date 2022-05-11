import { Command } from '@oclif/core';

import ClearCache from './clear-cache';
import CreateAppCommand from './create-app';
import CreateBalanceFetcher from './create-balance-fetcher';
import CreateContractPositionFetcher from './create-contract-position-fetcher';
import CreateTokenFetcher from './create-token-fetcher';
import CreateTvlFetcher from './create-tvl-fetcher';
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
  'create-token-fetcher': CreateTokenFetcher,
  'create-balance-fetcher': CreateBalanceFetcher,
  'create-contract-position-fetcher': CreateContractPositionFetcher,
  'create-tvl-fetcher': CreateTvlFetcher,
  'clear-cache': ClearCache,
  'set-network-provider': SetNetworkProvider,
};
