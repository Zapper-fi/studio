import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';

import { CurveContractFactory, CurveCryptoFactory } from '../contracts';

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

export abstract class CurveFactoryCryptoPoolTokenFetcher extends CurvePoolTokenFetcher<CurveCryptoFactory> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(CurveContractFactory) protected readonly contractFactory: CurveContractFactory,
    @Inject(CurveVolumeDataLoader) protected readonly curveVolumeDataLoader: CurveVolumeDataLoader,
  ) {
    super(appToolkit, contractFactory, curveVolumeDataLoader);
  }

  resolveRegistry(address: string): CurveCryptoFactory {
    return this.contractFactory.curveCryptoFactory({ address, network: this.network });
  }

  async resolvePoolCount({ registryContract }: ResolvePoolCountParams<CurveCryptoFactory>) {
    return registryContract.pool_count();
  }

  async resolveSwapAddress({ registryContract, poolIndex }: ResolveSwapAddressParams<CurveCryptoFactory>) {
    return registryContract.pool_list(poolIndex);
  }

  async resolveTokenAddress({ swapAddress }: ResolveTokenAddressParams<CurveCryptoFactory>) {
    return swapAddress;
  }

  async resolveCoinAddresses({ registryContract, swapAddress }: ResolveCoinAddressesParams<CurveCryptoFactory>) {
    return registryContract.get_coins(swapAddress);
  }

  async resolveReserves({ registryContract, swapAddress }: ResolveReservesParams<CurveCryptoFactory>) {
    return registryContract.get_balances(swapAddress);
  }

  async resolveFees({ swapAddress, multicall }: ResolveFeesParams<CurveCryptoFactory>) {
    const swapContract = this.contractFactory.curvePool({ address: swapAddress, network: this.network });
    const fee = await multicall.wrap(swapContract).fee();
    return [fee, 0];
  }
}
