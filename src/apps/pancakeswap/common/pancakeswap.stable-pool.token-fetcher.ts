import { Inject } from '@nestjs/common';
import { range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';

import { PancakeswapViemContractFactory } from '../contracts';
import { PancakeswapStablePool, PancakeswapStablePoolRegistry } from '../contracts/viem';
import { PancakeswapStablePoolContract } from '../contracts/viem/PancakeswapStablePool';
import { PancakeswapStablePoolRegistryContract } from '../contracts/viem/PancakeswapStablePoolRegistry';

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
    @Inject(PancakeswapViemContractFactory) protected readonly contractFactory: PancakeswapViemContractFactory,
  ) {
    super(appToolkit, contractFactory);
  }

  resolveRegistry(address: string): PancakeswapStablePoolRegistryContract {
    return this.contractFactory.pancakeswapStablePoolRegistry({ address, network: this.network });
  }

  resolveStablePool(address: string): PancakeswapStablePoolContract {
    return this.contractFactory.pancakeswapStablePool({ address, network: this.network });
  }

  async resolvePoolCount({ contract }: ResolvePoolCountParams<PancakeswapStablePoolRegistry>) {
    return contract.read.pairLength();
  }

  async resolveSwapAddress({ contract, poolIndex }: ResolveSwapAddressParams<PancakeswapStablePoolRegistry>) {
    return contract.read.swapPairContract([BigInt(poolIndex)]);
  }

  async resolveTokenAddress({ contract }: ResolveTokenAddressParams<PancakeswapStablePool>) {
    return contract.read.token();
  }

  async resolveCoinAddresses({ contract }: ResolveCoinAddressesParams<PancakeswapStablePool>) {
    const coinCount = await contract.read.N_COINS();
    return Promise.all(
      range(0, Number(coinCount)).map(async coinIndex => await contract.read.coins([BigInt(coinIndex)])),
    );
  }

  async resolveReserves({ contract }: ResolveReservesParams<PancakeswapStablePool>) {
    const coinCount = await contract.read.N_COINS();
    return Promise.all(
      range(0, Number(coinCount)).map(async coinIndex => await contract.read.balances([BigInt(coinIndex)])),
    );
  }

  async resolveFees({ contract }: ResolveFeesParams<PancakeswapStablePool>) {
    return contract.read.fee();
  }
}
