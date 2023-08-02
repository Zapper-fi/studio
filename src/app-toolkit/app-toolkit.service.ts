import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { BigNumber as BigNumberJS } from 'bignumber.js';
import { Cache } from 'cache-manager';
import { ethers } from 'ethers';

import { AppService } from '~app/app.service';
import { ContractFactory } from '~contract';
import { MulticallService } from '~multicall/multicall.service';
import { NetworkProviderService } from '~network-provider/network-provider.service';
import { DefaultDataProps } from '~position/display.interface';
import { PositionKeyService } from '~position/position-key.service';
import { AppTokenPosition, ContractPosition, NonFungibleToken } from '~position/position.interface';
import { AppGroupsDefinition, PositionService } from '~position/position.service';
import { CreateTokenDependencySelectorOptions } from '~position/selectors/token-dependency-selector.interface';
import { TokenDependencySelectorService } from '~position/selectors/token-dependency-selector.service';
import { BaseToken } from '~position/token.interface';
import { PriceSelectorService } from '~token/selectors/token-price-selector.service';
import { Network } from '~types/network.interface';

import { IAppToolkit } from './app-toolkit.interface';

@Injectable()
export class AppToolkit implements IAppToolkit {
  private readonly contractFactory: ContractFactory;
  constructor(
    @Inject(AppService) private readonly appService: AppService,
    @Inject(NetworkProviderService) private readonly networkProviderService: NetworkProviderService,
    @Inject(PositionService) private readonly positionService: PositionService,
    @Inject(PositionKeyService)
    private readonly positionKeyService: PositionKeyService,
    @Inject(PriceSelectorService) private readonly priceSelectorService: PriceSelectorService,
    @Inject(TokenDependencySelectorService)
    private readonly tokenDependencySelectorService: TokenDependencySelectorService,
    @Inject(MulticallService) private readonly multicallService: MulticallService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {
    this.contractFactory = new ContractFactory((network: Network) => this.networkProviderService.getProvider(network));
  }

  // Network Related

  get globalContracts() {
    return this.contractFactory;
  }

  getNetworkProvider(network: Network) {
    return this.networkProviderService.getProvider(network);
  }

  getMulticall(network: Network) {
    return this.multicallService.getMulticall(network);
  }

  // Base Tokens

  getBaseTokenPrices(network: Network) {
    return this.priceSelectorService.create().getAll({ network });
  }

  getBaseTokenPrice(opts: { network: Network; address: string }) {
    return this.priceSelectorService.create().getOne(opts);
  }

  // Positions

  getAppTokenPositions<T = DefaultDataProps>(...appTokenDefinitions: AppGroupsDefinition[]) {
    return this.positionService.getAppTokenPositions<T>(...appTokenDefinitions);
  }

  getAppTokenPositionsFromDatabase<T = DefaultDataProps>(...appTokenDefinitions: AppGroupsDefinition[]) {
    return this.positionService.getAppTokenPositions<T>(...appTokenDefinitions);
  }

  getAppContractPositions<T = DefaultDataProps>(...appTokenDefinitions: AppGroupsDefinition[]) {
    return this.positionService.getAppContractPositions<T>(...appTokenDefinitions);
  }

  // Token Dependencies

  getTokenDependencySelector(opts: CreateTokenDependencySelectorOptions = {}) {
    return this.tokenDependencySelectorService.create(opts);
  }

  // Position Key

  getPositionKey(position: ContractPosition | AppTokenPosition | BaseToken | NonFungibleToken) {
    return this.positionKeyService.getPositionKey(position);
  }

  // Cache

  async getFromCache<T = any>(key: string) {
    // In production, this is a Redis `get`
    return this.cacheManager.get<T>(key);
  }

  async setManyToCache<T = any>(entries: [string, T][], ttl = 60) {
    // In production, this is a Redis pipeline of `set` commands
    await Promise.all(entries.map(([key, value]) => this.cacheManager.set(key, value, { ttl })));
  }

  getBigNumber(source: BigNumberJS.Value | ethers.BigNumber): BigNumberJS {
    if (source instanceof ethers.BigNumber) return new BigNumberJS(source.toString());
    return new BigNumberJS(source);
  }
}
