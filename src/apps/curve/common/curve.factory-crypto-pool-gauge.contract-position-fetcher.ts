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

  async resolvePoolCount({ contract }: ResolvePoolCountParams<CurveCryptoFactory>) {
    return contract.pool_count();
  }

  async resolveSwapAddress({ contract, poolIndex }: ResolveSwapAddressParams<CurveCryptoFactory>) {
    return contract.pool_list(poolIndex);
  }

  async resolveTokenAddress({ contract, swapAddress }: ResolveTokenAddressParams<CurveCryptoFactory>) {
    return contract.get_token(swapAddress);
  }

  async resolveGaugeAddresses({ contract, swapAddress }: ResolveGaugeAddressParams<CurveCryptoFactory>) {
    return contract.get_gauge(swapAddress).then(v => [v]);
  }
}
