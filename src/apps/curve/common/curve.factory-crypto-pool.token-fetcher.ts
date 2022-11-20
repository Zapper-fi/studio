import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';

import { CurveContractFactory, CurveCryptoFactory } from '../contracts';

import { CurvePoolTokenFetcher } from './curve.pool.token-fetcher';

export abstract class CurveFactoryCryptoPoolTokenFetcher extends CurvePoolTokenFetcher<CurveCryptoFactory> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(CurveContractFactory) protected readonly contractFactory: CurveContractFactory,
  ) {
    super(appToolkit, contractFactory);
  }

  resolveRegistry(address: string): CurveCryptoFactory {
    return this.contractFactory.curveCryptoFactory({ address, network: this.network });
  }

  resolvePoolCount(registryContract: CurveCryptoFactory): Promise<BigNumberish> {
    return registryContract.pool_count();
  }

  resolveSwapAddress(registryContract: CurveCryptoFactory, index: number): Promise<string> {
    return registryContract.pool_list(index);
  }

  resolveTokenAddress(registryContract: CurveCryptoFactory, swapAddress: string): Promise<string> {
    return Promise.resolve(swapAddress);
  }

  resolveCoinAddresses(registryContract: CurveCryptoFactory, swapAddress: string): Promise<string[]> {
    return registryContract.get_coins(swapAddress);
  }

  resolveReserves(registryContract: CurveCryptoFactory, swapAddress: string): Promise<BigNumberish[]> {
    return registryContract.get_balances(swapAddress);
  }

  resolveFees(_registryContract: CurveCryptoFactory, _swapAddress: string): Promise<BigNumberish[]> {
    return Promise.resolve([0, 0]); // @TODO On swap address
  }
}
