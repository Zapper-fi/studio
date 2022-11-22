import { CurveCryptoFactory } from '../contracts';

import {
  CurvePoolGaugeContractPositionFetcher,
  ResolveGaugeAddressParams,
  ResolvePoolCountParams,
  ResolveSwapAddressParams,
  ResolveTokenAddressParams,
} from './curve.pool-gauge.contract-position-fetcher';

export abstract class CurveFactoryCryptoPoolGaugeContractPositionFetcher extends CurvePoolGaugeContractPositionFetcher<CurveCryptoFactory> {
  resolveRegistry(address: string): CurveCryptoFactory {
    return this.contractFactory.curveCryptoFactory({ address, network: this.network });
  }

  async resolvePoolCount({ registryContract }: ResolvePoolCountParams<CurveCryptoFactory>) {
    return registryContract.pool_count();
  }

  async resolveSwapAddress({ registryContract, poolIndex }: ResolveSwapAddressParams<CurveCryptoFactory>) {
    return registryContract.pool_list(poolIndex);
  }

  async resolveTokenAddress({ swapAddress }: ResolveTokenAddressParams<CurveCryptoFactory>) {
    return swapAddress;
  }

  async resolveGaugeAddresses({ registryContract, swapAddress }: ResolveGaugeAddressParams<CurveCryptoFactory>) {
    return registryContract.get_gauge(swapAddress).then(v => [v]);
  }
}
