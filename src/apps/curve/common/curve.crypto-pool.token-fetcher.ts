import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';

import { CurveContractFactory, CurveCryptoRegistry } from '../contracts';

import { CurvePoolTokenFetcher } from './curve.pool.token-fetcher';

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

  resolvePoolCount(registryContract: CurveCryptoRegistry): Promise<BigNumberish> {
    return registryContract.pool_count();
  }

  resolveSwapAddress(registryContract: CurveCryptoRegistry, index: number): Promise<string> {
    return registryContract.pool_list(index);
  }

  resolveTokenAddress(registryContract: CurveCryptoRegistry, swapAddress: string): Promise<string> {
    return registryContract.get_lp_token(swapAddress);
  }

  resolveCoinAddresses(registryContract: CurveCryptoRegistry, swapAddress: string): Promise<string[]> {
    return registryContract.get_coins(swapAddress);
  }

  resolveReserves(registryContract: CurveCryptoRegistry, swapAddress: string): Promise<BigNumberish[]> {
    return registryContract.get_balances(swapAddress);
  }

  resolveFees(registryContract: CurveCryptoRegistry, swapAddress: string): Promise<BigNumberish[]> {
    return registryContract.get_fees(swapAddress);
  }
}
