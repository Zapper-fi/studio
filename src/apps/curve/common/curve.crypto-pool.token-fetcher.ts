import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';

import { CurveViemContractFactory } from '../contracts';
import { CurveCryptoRegistry } from '../contracts/viem';
import { CurveCryptoRegistryContract } from '../contracts/viem/CurveCryptoRegistry';

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

  resolveRegistry(address: string): CurveCryptoRegistryContract {
    return this.contractFactory.curveCryptoRegistry({ address, network: this.network });
  }

  async resolvePoolCount({ contract }: ResolvePoolCountParams<CurveCryptoRegistry>) {
    return contract.read.pool_count();
  }

  async resolveSwapAddress({ contract, poolIndex }: ResolveSwapAddressParams<CurveCryptoRegistry>) {
    return contract.read.pool_list([BigInt(poolIndex)]);
  }

  async resolveTokenAddress({ contract, swapAddress }: ResolveTokenAddressParams<CurveCryptoRegistry>) {
    return contract.read.get_lp_token([swapAddress]);
  }

  async resolveCoinAddresses({ contract, swapAddress }: ResolveCoinAddressesParams<CurveCryptoRegistry>) {
    return contract.read.get_coins([swapAddress]).then(v => [...v]);
  }

  async resolveReserves({ contract, swapAddress }: ResolveReservesParams<CurveCryptoRegistry>) {
    return contract.read.get_balances([swapAddress]).then(v => [...v]);
  }

  async resolveFees({ contract, swapAddress }: ResolveFeesParams<CurveCryptoRegistry>) {
    return contract.read.get_fees([swapAddress]).then(v => [...v]);
  }
}
