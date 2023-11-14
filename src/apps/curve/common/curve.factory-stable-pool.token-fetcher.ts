import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';

import { CurveViemContractFactory } from '../contracts';
import { CurveStableFactory } from '../contracts/viem';
import { CurveStableFactoryContract } from '../contracts/viem/CurveStableFactory';

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
    @Inject(CurveViemContractFactory) protected readonly contractFactory: CurveViemContractFactory,
    @Inject(CurveVolumeDataLoader) protected readonly curveVolumeDataLoader: CurveVolumeDataLoader,
  ) {
    super(appToolkit, contractFactory, curveVolumeDataLoader);
  }

  resolveRegistry(address: string): CurveStableFactoryContract {
    return this.contractFactory.curveStableFactory({ address, network: this.network });
  }

  async resolvePoolCount({ contract }: ResolvePoolCountParams<CurveStableFactory>) {
    return contract.read.pool_count();
  }

  async resolveSwapAddress({ contract, poolIndex }: ResolveSwapAddressParams<CurveStableFactory>) {
    return contract.read.pool_list([BigInt(poolIndex)]);
  }

  async resolveTokenAddress({ swapAddress }: ResolveTokenAddressParams<CurveStableFactory>) {
    return swapAddress;
  }

  async resolveCoinAddresses({ contract, swapAddress }: ResolveCoinAddressesParams<CurveStableFactory>) {
    return contract.read.get_coins([swapAddress]).then(v => [...v]);
  }

  async resolveReserves({ contract, swapAddress }: ResolveReservesParams<CurveStableFactory>) {
    return contract.read.get_balances([swapAddress]).then(v => [...v]);
  }

  async resolveFees({ contract, swapAddress }: ResolveFeesParams<CurveStableFactory>) {
    return contract.read.get_fees([swapAddress]).then(v => [...v]);
  }
}
