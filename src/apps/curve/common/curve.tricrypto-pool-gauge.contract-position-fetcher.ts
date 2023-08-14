import { CurveTricryptoFactory } from '../contracts';

import {
  CurvePoolGaugeV6ContractPositionFetcher,
  ResolveGaugeAddressParams,
  ResolvePoolCountParams,
  ResolveTokenAddressParams,
} from './curve.pool-gauge-v6.contract-position-fetcher';

export abstract class CurveTricryptoPoolGaugeContractPositionFetcher extends CurvePoolGaugeV6ContractPositionFetcher<CurveTricryptoFactory> {
  resolveFactory(address: string): CurveTricryptoFactory {
    return this.contractFactory.curveTricryptoFactory({ address, network: this.network });
  }

  async resolvePoolCount({ contract }: ResolvePoolCountParams<CurveTricryptoFactory>) {
    return contract.pool_count();
  }

  async resolveTokenAddress({ contract, poolIndex }: ResolveTokenAddressParams<CurveTricryptoFactory>) {
    return contract.pool_list(poolIndex);
  }

  async resolveGaugeAddress({ contract, tokenAddress }: ResolveGaugeAddressParams<CurveTricryptoFactory>) {
    return contract.get_gauge(tokenAddress);
  }
}
