import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';

import { CurveContractFactory, CurveStableRegistry } from '../contracts';

import {
  CurvePoolTokenFetcher,
  ResolveCoinAddressesParams,
  ResolveFeesParams,
  ResolvePoolCountParams,
  ResolveReservesParams,
  ResolveSwapAddressParams,
  ResolveTokenAddressParams,
} from './curve.pool.token-fetcher';
import { CurveVolumeDataLoader } from './curve.volume.data-loader';

export abstract class CurveStablePoolTokenFetcher extends CurvePoolTokenFetcher<CurveStableRegistry> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(CurveContractFactory) protected readonly contractFactory: CurveContractFactory,
    @Inject(CurveVolumeDataLoader) protected readonly curveVolumeDataLoader: CurveVolumeDataLoader,
  ) {
    super(appToolkit, contractFactory, curveVolumeDataLoader);
  }

  resolveRegistry(address: string): CurveStableRegistry {
    return this.contractFactory.curveStableRegistry({ address, network: this.network });
  }

  async resolvePoolCount({ registryContract }: ResolvePoolCountParams<CurveStableRegistry>) {
    return registryContract.pool_count();
  }

  async resolveSwapAddress({ registryContract, poolIndex }: ResolveSwapAddressParams<CurveStableRegistry>) {
    return registryContract.pool_list(poolIndex);
  }

  async resolveTokenAddress({ registryContract, swapAddress }: ResolveTokenAddressParams<CurveStableRegistry>) {
    return registryContract.get_lp_token(swapAddress);
  }

  async resolveCoinAddresses({ registryContract, swapAddress }: ResolveCoinAddressesParams<CurveStableRegistry>) {
    return registryContract.get_coins(swapAddress);
  }

  async resolveReserves({ registryContract, swapAddress }: ResolveReservesParams<CurveStableRegistry>) {
    return registryContract.get_balances(swapAddress);
  }

  async resolveFees({ registryContract, swapAddress }: ResolveFeesParams<CurveStableRegistry>) {
    return registryContract.get_fees(swapAddress);
  }
}
