import { Inject } from '@nestjs/common';
import { range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';

import { PancakeswapContractFactory, PancakeswapStablePool, PancakeswapStablePoolRegistry } from '../contracts';

import {
  PancakeswapPoolDynamicTokenFetcher,
  ResolveCoinAddressesParams,
  ResolveFeesParams,
  ResolvePoolCountParams,
  ResolveReservesParams,
  ResolveSwapAddressParams,
  ResolveTokenAddressParams,
} from './pancakeswap.pool-dynamic.token-fetcher';

export abstract class PancakeswapStablePoolTokenFetcher extends PancakeswapPoolDynamicTokenFetcher<
  PancakeswapStablePoolRegistry,
  PancakeswapStablePool
> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PancakeswapContractFactory) protected readonly contractFactory: PancakeswapContractFactory,
  ) {
    super(appToolkit, contractFactory);
  }

  resolveRegistry(address: string): PancakeswapStablePoolRegistry {
    return this.contractFactory.pancakeswapStablePoolRegistry({ address, network: this.network });
  }

  resolveStablePool(address: string): PancakeswapStablePool {
    return this.contractFactory.pancakeswapStablePool({ address, network: this.network });
  }

  async resolvePoolCount({ contract }: ResolvePoolCountParams<PancakeswapStablePoolRegistry>) {
    return contract.pairLength();
  }

  async resolveSwapAddress({ contract, poolIndex }: ResolveSwapAddressParams<PancakeswapStablePoolRegistry>) {
    return contract.swapPairContract(poolIndex);
  }

  async resolveTokenAddress({ contract }: ResolveTokenAddressParams<PancakeswapStablePool>) {
    return contract.token();
  }

  async resolveCoinAddresses({ contract }: ResolveCoinAddressesParams<PancakeswapStablePool>) {
    const coinCount = await contract.N_COINS();
    return Promise.all(range(0, Number(coinCount)).map(async coinIndex => await contract.coins(coinIndex)));
  }

  async resolveReserves({ contract }: ResolveReservesParams<PancakeswapStablePool>) {
    const coinCount = await contract.N_COINS();
    return Promise.all(range(0, Number(coinCount)).map(async coinIndex => await contract.balances(coinIndex)));
  }

  async resolveFees({ contract }: ResolveFeesParams<PancakeswapStablePool>) {
    return contract.fee();
  }
}
