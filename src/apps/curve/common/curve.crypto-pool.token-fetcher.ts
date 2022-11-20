import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';

import { CurveContractFactory, CurveCryptoRegistry } from '../contracts';

import {
  CurvePoolTokenFetcher,
  ResolveCoinAddressesParams,
  ResolveFeesParams,
  ResolvePoolCountParams,
  ResolveReservesParams,
  ResolveSwapAddressParams,
  ResolveTokenAddressParams,
} from './curve.pool.token-fetcher';

export abstract class CurveCryptoPoolTokenFetcher extends CurvePoolTokenFetcher<CurveCryptoRegistry> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(CurveContractFactory) protected readonly contractFactory: CurveContractFactory,
  ) {
    super(appToolkit, contractFactory);
  }

  resolveRegistry(address: string): CurveCryptoRegistry {
    return this.contractFactory.curveCryptoRegistry({ address, network: this.network });
  }

  async resolvePoolCount({ registryContract }: ResolvePoolCountParams<CurveCryptoRegistry>) {
    return registryContract.pool_count();
  }

  async resolveSwapAddress({ registryContract, poolIndex }: ResolveSwapAddressParams<CurveCryptoRegistry>) {
    return registryContract.pool_list(poolIndex);
  }

  async resolveTokenAddress({ registryContract, swapAddress }: ResolveTokenAddressParams<CurveCryptoRegistry>) {
    return registryContract.get_lp_token(swapAddress);
  }

  async resolveCoinAddresses({ registryContract, swapAddress }: ResolveCoinAddressesParams<CurveCryptoRegistry>) {
    return registryContract.get_coins(swapAddress);
  }

  async resolveReserves({ registryContract, swapAddress }: ResolveReservesParams<CurveCryptoRegistry>) {
    return registryContract.get_balances(swapAddress);
  }

  async resolveFees({ registryContract, swapAddress }: ResolveFeesParams<CurveCryptoRegistry>) {
    return registryContract.get_fees(swapAddress);
  }
}
