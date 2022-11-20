import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';

import { CurveContractFactory, CurveStableFactory } from '../contracts';

import {
  CurvePoolTokenFetcher,
  ResolveCoinAddressesParams,
  ResolveFeesParams,
  ResolvePoolCountParams,
  ResolveReservesParams,
  ResolveSwapAddressParams,
  ResolveTokenAddressParams,
} from './curve.pool.token-fetcher';

export abstract class CurveFactoryStablePoolTokenFetcher extends CurvePoolTokenFetcher<CurveStableFactory> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(CurveContractFactory) protected readonly contractFactory: CurveContractFactory,
  ) {
    super(appToolkit, contractFactory);
  }

  resolveRegistry(address: string): CurveStableFactory {
    return this.contractFactory.curveStableFactory({ address, network: this.network });
  }

  async resolvePoolCount({ registryContract }: ResolvePoolCountParams<CurveStableFactory>) {
    return registryContract.pool_count();
  }

  async resolveSwapAddress({ registryContract, poolIndex }: ResolveSwapAddressParams<CurveStableFactory>) {
    return registryContract.pool_list(poolIndex);
  }

  async resolveTokenAddress({ swapAddress }: ResolveTokenAddressParams<CurveStableFactory>) {
    return swapAddress;
  }

  async resolveCoinAddresses({ registryContract, swapAddress }: ResolveCoinAddressesParams<CurveStableFactory>) {
    return registryContract.get_coins(swapAddress);
  }

  async resolveReserves({ registryContract, swapAddress }: ResolveReservesParams<CurveStableFactory>) {
    return registryContract.get_balances(swapAddress);
  }

  async resolveFees({ registryContract, swapAddress }: ResolveFeesParams<CurveStableFactory>) {
    return registryContract.get_fees(swapAddress);
  }
}
