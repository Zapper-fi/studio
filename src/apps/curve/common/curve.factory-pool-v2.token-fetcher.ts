import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';

import { CurveContractFactory, CurveTricryptoFactory } from '../contracts';

import {
  CurvePoolDynamicV2TokenFetcher,
  ResolveCoinAddressesParams,
  ResolvePoolCountParams,
  ResolveReservesParams,
  ResolveTokenAddressParams,
} from './curve.pool-dynamic-v2.token-fetcher';
import { CurveVolumeDataLoader } from './curve.volume.data-loader';

export abstract class CurveFactoryV2PoolTokenFetcher extends CurvePoolDynamicV2TokenFetcher<CurveTricryptoFactory> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(CurveContractFactory) protected readonly contractFactory: CurveContractFactory,
    @Inject(CurveVolumeDataLoader) protected readonly curveVolumeDataLoader: CurveVolumeDataLoader,
  ) {
    super(appToolkit, contractFactory, curveVolumeDataLoader);
  }

  resolveFactory(address: string): CurveTricryptoFactory {
    return this.contractFactory.curveTricryptoFactory({ address, network: this.network });
  }

  async resolvePoolCount({ contract }: ResolvePoolCountParams<CurveTricryptoFactory>) {
    return contract.pool_count();
  }

  async resolveTokenAddress({ contract, poolIndex }: ResolveTokenAddressParams<CurveTricryptoFactory>) {
    return contract.pool_list(poolIndex);
  }

  async resolveCoinAddresses({ contract, tokenAddress }: ResolveCoinAddressesParams<CurveTricryptoFactory>) {
    return contract.get_coins(tokenAddress);
  }

  async resolveReserves({ contract, tokenAddress }: ResolveReservesParams<CurveTricryptoFactory>) {
    return contract.get_balances(tokenAddress);
  }
}
