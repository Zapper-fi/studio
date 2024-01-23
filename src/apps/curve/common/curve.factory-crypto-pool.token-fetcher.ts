import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { isViemMulticallUnderlyingError } from '~multicall/errors';

import { CurveViemContractFactory } from '../contracts';
import { CurveCryptoFactory } from '../contracts/viem';
import { CurveCryptoFactoryContract } from '../contracts/viem/CurveCryptoFactory';

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

export abstract class CurveFactoryCryptoPoolTokenFetcher extends CurvePoolDynamicTokenFetcher<CurveCryptoFactory> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(CurveViemContractFactory) protected readonly contractFactory: CurveViemContractFactory,
    @Inject(CurveVolumeDataLoader) protected readonly curveVolumeDataLoader: CurveVolumeDataLoader,
  ) {
    super(appToolkit, contractFactory, curveVolumeDataLoader);
  }

  resolveRegistry(address: string): CurveCryptoFactoryContract {
    return this.contractFactory.curveCryptoFactory({ address, network: this.network });
  }

  async resolvePoolCount({ contract }: ResolvePoolCountParams<CurveCryptoFactory>) {
    return contract.read.pool_count();
  }

  async resolveSwapAddress({ contract, poolIndex }: ResolveSwapAddressParams<CurveCryptoFactory>) {
    return contract.read.pool_list([BigInt(poolIndex)]);
  }

  async resolveTokenAddress({ contract, swapAddress }: ResolveTokenAddressParams<CurveCryptoFactory>) {
    return contract.read.get_token([swapAddress]);
  }

  async resolveCoinAddresses({ contract, swapAddress }: ResolveCoinAddressesParams<CurveCryptoFactory>) {
    return contract.read.get_coins([swapAddress]).then(v => [...v]);
  }

  async resolveReserves({ contract, swapAddress }: ResolveReservesParams<CurveCryptoFactory>) {
    return contract.read.get_balances([swapAddress]).then(v => [...v]);
  }

  async resolveFees({ swapAddress, multicall }: ResolveFeesParams<CurveCryptoFactory>) {
    const swapContract = this.contractFactory.curvePool({ address: swapAddress, network: this.network });
    const fee = await multicall
      .wrap(swapContract)
      .read.fee()
      .catch(err => {
        if (isViemMulticallUnderlyingError(err)) return 0;
        throw err;
      });

    return [fee, 0];
  }
}
