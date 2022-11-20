import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';

import { CurveContractFactory, CurveStableRegistry } from '../contracts';

import { CurvePoolTokenFetcher } from './curve.pool.token-fetcher';

export abstract class CurveStablePoolTokenFetcher extends CurvePoolTokenFetcher<CurveStableRegistry> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(CurveContractFactory) protected readonly contractFactory: CurveContractFactory,
  ) {
    super(appToolkit, contractFactory);
  }

  resolveRegistry(address: string): CurveStableRegistry {
    return this.contractFactory.curveStableRegistry({ address, network: this.network });
  }

  resolvePoolCount(registryContract: CurveStableRegistry): Promise<BigNumberish> {
    return registryContract.pool_count();
  }

  resolveSwapAddress(registryContract: CurveStableRegistry, index: number): Promise<string> {
    return registryContract.pool_list(index);
  }

  resolveTokenAddress(registryContract: CurveStableRegistry, swapAddress: string): Promise<string> {
    return registryContract.get_lp_token(swapAddress);
  }

  resolveCoinAddresses(registryContract: CurveStableRegistry, swapAddress: string): Promise<string[]> {
    return registryContract.get_coins(swapAddress);
  }

  resolveReserves(registryContract: CurveStableRegistry, swapAddress: string): Promise<BigNumberish[]> {
    return registryContract.get_balances(swapAddress);
  }

  resolveFees(registryContract: CurveStableRegistry, swapAddress: string): Promise<BigNumberish[]> {
    return registryContract.get_fees(swapAddress);
  }
}
