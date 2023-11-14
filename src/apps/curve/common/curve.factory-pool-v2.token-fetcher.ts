import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';

import { CurveViemContractFactory } from '../contracts';
import { CurveTricryptoFactory } from '../contracts/viem';
import { CurveTricryptoFactoryContract } from '../contracts/viem/CurveTricryptoFactory';

import {
  CurvePoolDynamicV2TokenFetcher,
  ResolveCoinAddressesParams,
  ResolvePoolCountParams,
  ResolveReservesParams,
  ResolveTokenAddressParams,
} from './curve.pool-dynamic-v2.token-fetcher';
import { CurveVolumeDataLoader } from './curve.volume.data-loader';

export abstract class CurveFactoryV2PoolTokenFetcher extends CurvePoolDynamicV2TokenFetcher<CurveTricryptoFactory> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(CurveViemContractFactory) protected readonly contractFactory: CurveViemContractFactory,
    @Inject(CurveVolumeDataLoader) protected readonly curveVolumeDataLoader: CurveVolumeDataLoader,
  ) {
    super(appToolkit, contractFactory, curveVolumeDataLoader);
  }

  resolveFactory(address: string): CurveTricryptoFactoryContract {
    return this.contractFactory.curveTricryptoFactory({ address, network: this.network });
  }

  async resolvePoolCount({ contract }: ResolvePoolCountParams<CurveTricryptoFactory>) {
    return contract.read.pool_count();
  }

  async resolveTokenAddress({ contract, poolIndex }: ResolveTokenAddressParams<CurveTricryptoFactory>) {
    return contract.read.pool_list([BigInt(poolIndex)]);
  }

  async resolveCoinAddresses({ contract, tokenAddress }: ResolveCoinAddressesParams<CurveTricryptoFactory>) {
    return contract.read.get_coins([tokenAddress]).then(v => [...v]);
  }

  async resolveReserves({ contract, tokenAddress }: ResolveReservesParams<CurveTricryptoFactory>) {
    return contract.read.get_balances([tokenAddress]).then(v => [...v]);
  }
}
