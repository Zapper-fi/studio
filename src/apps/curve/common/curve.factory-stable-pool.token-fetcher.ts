import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';

import { CurveContractFactory, CurveStableFactory } from '../contracts';

import {
  CurvePoolDynamicTokenFetcher,
  ResolveCoinAddressesParams,
  ResolveFeesParams,
  ResolvePoolCountParams,
  ResolveReservesParams,
  ResolveSwapAddressParams,
  ResolveTokenAddressParams,
} from './curve.pool-dynamic.token-fetcher';
import { CurveVolumeDataLoader } from './curve.volume.data-loader';

export abstract class CurveFactoryStablePoolTokenFetcher extends CurvePoolDynamicTokenFetcher<CurveStableFactory> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(CurveContractFactory) protected readonly contractFactory: CurveContractFactory,
    @Inject(CurveVolumeDataLoader) protected readonly curveVolumeDataLoader: CurveVolumeDataLoader,
  ) {
    super(appToolkit, contractFactory, curveVolumeDataLoader);
  }

  resolveRegistry(address: string): CurveStableFactory {
    return this.contractFactory.curveStableFactory({ address, network: this.network });
  }

  async resolvePoolCount({ contract }: ResolvePoolCountParams<CurveStableFactory>) {
    return contract.pool_count();
  }

  async resolveSwapAddress({ contract, poolIndex }: ResolveSwapAddressParams<CurveStableFactory>) {
    return contract.pool_list(poolIndex);
  }

  async resolveTokenAddress({ swapAddress }: ResolveTokenAddressParams<CurveStableFactory>) {
    return swapAddress;
  }

  async resolveCoinAddresses({ contract, swapAddress }: ResolveCoinAddressesParams<CurveStableFactory>) {
    return contract.get_coins(swapAddress);
  }

  async resolveReserves({ contract, swapAddress }: ResolveReservesParams<CurveStableFactory>) {
    return contract.get_balances(swapAddress);
  }

  async resolveFees({ contract, swapAddress }: ResolveFeesParams<CurveStableFactory>) {
    return contract.get_fees(swapAddress);
  }
}
