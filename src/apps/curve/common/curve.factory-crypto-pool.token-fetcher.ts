import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { isMulticallUnderlyingError } from '~multicall/impl/multicall.ethers';

import { CurveContractFactory, CurveCryptoFactory } from '../contracts';

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

  resolveRegistry(address: string): CurveCryptoFactory {
    return this.contractFactory.curveCryptoFactory({ address, network: this.network });
  }

  async resolvePoolCount({ contract }: ResolvePoolCountParams<CurveCryptoFactory>) {
    return contract.pool_count();
  }

  async resolveSwapAddress({ contract, poolIndex }: ResolveSwapAddressParams<CurveCryptoFactory>) {
    return contract.pool_list(poolIndex);
  }

  async resolveTokenAddress({ contract, swapAddress }: ResolveTokenAddressParams<CurveCryptoFactory>) {
    return contract.get_token(swapAddress);
  }

  async resolveCoinAddresses({ contract, swapAddress }: ResolveCoinAddressesParams<CurveCryptoFactory>) {
    return contract.get_coins(swapAddress);
  }

  async resolveReserves({ contract, swapAddress }: ResolveReservesParams<CurveCryptoFactory>) {
    return contract.get_balances(swapAddress);
  }

  async resolveFees({ swapAddress, multicall }: ResolveFeesParams<CurveCryptoFactory>) {
    const swapContract = this.contractFactory.curvePool({ address: swapAddress, network: this.network });
    const fee = await multicall
      .wrap(swapContract)
      .fee()
      .catch(err => {
        if (isMulticallUnderlyingError(err)) return 0;
        throw err;
      });

    return [fee, 0];
  }
}
