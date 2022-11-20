import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';

import { CurveContractFactory, CurveStableFactory } from '../contracts';

import { CurvePoolTokenFetcher } from './curve.pool.token-fetcher';

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

  resolvePoolCount(registryContract: CurveStableFactory): Promise<BigNumberish> {
    return registryContract.pool_count();
  }

  resolveSwapAddress(registryContract: CurveStableFactory, index: number): Promise<string> {
    return registryContract.pool_list(index);
  }

  resolveTokenAddress(registryContract: CurveStableFactory, swapAddress: string): Promise<string> {
    return Promise.resolve(swapAddress);
  }

  resolveCoinAddresses(registryContract: CurveStableFactory, swapAddress: string): Promise<string[]> {
    return registryContract.get_coins(swapAddress);
  }

  resolveReserves(registryContract: CurveStableFactory, swapAddress: string): Promise<BigNumberish[]> {
    return registryContract.get_balances(swapAddress);
  }

  resolveFees(registryContract: CurveStableFactory, swapAddress: string): Promise<BigNumberish[]> {
    return registryContract.get_fees(swapAddress);
  }
}
