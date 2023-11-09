import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';

import { CurveContractFactory, CurveCryptoRegistry } from '../contracts';

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

export abstract class CurveCryptoPoolTokenFetcher extends CurvePoolDynamicTokenFetcher<CurveCryptoRegistry> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(CurveViemContractFactory) protected readonly contractFactory: CurveViemContractFactory,
    @Inject(CurveVolumeDataLoader) protected readonly curveVolumeDataLoader: CurveVolumeDataLoader,
  ) {
    super(appToolkit, contractFactory, curveVolumeDataLoader);
  }

  resolveRegistry(address: string): CurveCryptoRegistry {
    return this.contractFactory.curveCryptoRegistry({ address, network: this.network });
  }

  async resolvePoolCount({ contract }: ResolvePoolCountParams<CurveCryptoRegistry>) {
    return contract.pool_count();
  }

  async resolveSwapAddress({ contract, poolIndex }: ResolveSwapAddressParams<CurveCryptoRegistry>) {
    return contract.pool_list(poolIndex);
  }

  async resolveTokenAddress({ contract, swapAddress }: ResolveTokenAddressParams<CurveCryptoRegistry>) {
    return contract.get_lp_token(swapAddress);
  }

  async resolveCoinAddresses({ contract, swapAddress }: ResolveCoinAddressesParams<CurveCryptoRegistry>) {
    return contract.get_coins(swapAddress);
  }

  async resolveReserves({ contract, swapAddress }: ResolveReservesParams<CurveCryptoRegistry>) {
    return contract.get_balances(swapAddress);
  }

  async resolveFees({ contract, swapAddress }: ResolveFeesParams<CurveCryptoRegistry>) {
    return contract.get_fees(swapAddress);
  }
}
