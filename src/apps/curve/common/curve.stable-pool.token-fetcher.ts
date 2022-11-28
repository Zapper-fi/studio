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

  async resolvePoolCount({ contract }: ResolvePoolCountParams<CurveStableRegistry>) {
    return contract.pool_count();
  }

  async resolveSwapAddress({ contract, poolIndex }: ResolveSwapAddressParams<CurveStableRegistry>) {
    return contract.pool_list(poolIndex);
  }

  async resolveTokenAddress({ contract, swapAddress }: ResolveTokenAddressParams<CurveStableRegistry>) {
    return contract.get_lp_token(swapAddress);
  }

  async resolveCoinAddresses({ contract, swapAddress }: ResolveCoinAddressesParams<CurveStableRegistry>) {
    return contract.get_coins(swapAddress);
  }

  async resolveReserves({ contract, swapAddress }: ResolveReservesParams<CurveStableRegistry>) {
    return contract.get_balances(swapAddress);
  }

  async resolveFees({ contract, swapAddress }: ResolveFeesParams<CurveStableRegistry>) {
    return contract.get_fees(swapAddress);
  }
}
