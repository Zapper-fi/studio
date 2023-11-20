import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';

import { CurveViemContractFactory } from '../contracts';
import { CurveStableRegistry } from '../contracts/viem';
import { CurveStableRegistryContract } from '../contracts/viem/CurveStableRegistry';

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

export abstract class CurveStablePoolTokenFetcher extends CurvePoolDynamicTokenFetcher<CurveStableRegistry> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(CurveViemContractFactory) protected readonly contractFactory: CurveViemContractFactory,
    @Inject(CurveVolumeDataLoader) protected readonly curveVolumeDataLoader: CurveVolumeDataLoader,
  ) {
    super(appToolkit, contractFactory, curveVolumeDataLoader);
  }

  resolveRegistry(address: string): CurveStableRegistryContract {
    return this.contractFactory.curveStableRegistry({ address, network: this.network });
  }

  async resolvePoolCount({ contract }: ResolvePoolCountParams<CurveStableRegistry>) {
    return contract.read.pool_count();
  }

  async resolveSwapAddress({ contract, poolIndex }: ResolveSwapAddressParams<CurveStableRegistry>) {
    return contract.read.pool_list([BigInt(poolIndex)]);
  }

  async resolveTokenAddress({ contract, swapAddress }: ResolveTokenAddressParams<CurveStableRegistry>) {
    return contract.read.get_lp_token([swapAddress]);
  }

  async resolveCoinAddresses({ contract, swapAddress }: ResolveCoinAddressesParams<CurveStableRegistry>) {
    return contract.read.get_coins([swapAddress]).then(v => [...v]);
  }

  async resolveReserves({ contract, swapAddress }: ResolveReservesParams<CurveStableRegistry>) {
    return contract.read.get_balances([swapAddress]).then(v => [...v]);
  }

  async resolveFees({ contract, swapAddress }: ResolveFeesParams<CurveStableRegistry>) {
    return contract.read.get_fees([swapAddress]).then(v => [...v]);
  }
}
