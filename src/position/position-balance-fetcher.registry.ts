import { Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';

import { Network } from '~types/network.interface';
import { buildRegistry, Registry } from '~utils/build-registry';

import { ContractType } from './contract.interface';
import {
  POSITION_BALANCE_FETCHER_APP,
  POSITION_BALANCE_FETCHER_GROUP,
  POSITION_BALANCE_FETCHER_NETWORK,
  POSITION_BALANCE_FETCHER_TYPE,
} from './position-balance-fetcher.decorator';
import { PositionBalanceFetcher } from './position-balance-fetcher.interface';
import { PositionBalance } from './position-balance.interface';

@Injectable()
export class PositionBalanceFetcherRegistry implements OnModuleInit {
  private registry: Registry<[ContractType, Network, string, string], PositionBalanceFetcher<PositionBalance>> =
    new Map();

  constructor(private readonly discoveryService: DiscoveryService) {}

  onModuleInit() {
    this.registry = buildRegistry(this.discoveryService, [
      POSITION_BALANCE_FETCHER_TYPE,
      POSITION_BALANCE_FETCHER_NETWORK,
      POSITION_BALANCE_FETCHER_APP,
      POSITION_BALANCE_FETCHER_GROUP,
    ]);
  }

  get(opts: { type: ContractType; appId: string; groupId: string; network: Network }) {
    return this.registry.get(opts.type)?.get(opts.network)?.get(opts.appId)?.get(opts.groupId);
  }
}
