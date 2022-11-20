import {
  CurvePoolGaugeContractPositionFetcher,
  ResolveGaugeAddressParams,
  ResolvePoolCountParams,
  ResolveSwapAddressParams,
  ResolveTokenAddressParams,
} from '../common/curve.pool-gauge.contract-position-fetcher';
import { CurveStableRegistry } from '../contracts';

export abstract class CurveStablePoolGaugeContractPositionFetcher extends CurvePoolGaugeContractPositionFetcher<CurveStableRegistry> {
  resolveRegistry(address: string): CurveStableRegistry {
    return this.contractFactory.curveStableRegistry({ address, network: this.network });
  }

  async resolvePoolCount({ registryContract }: ResolvePoolCountParams<CurveStableRegistry>) {
    return registryContract.pool_count();
  }

  async resolveSwapAddress({ registryContract, poolIndex }: ResolveSwapAddressParams<CurveStableRegistry>) {
    return registryContract.pool_list(poolIndex);
  }

  async resolveTokenAddress({ registryContract, swapAddress }: ResolveTokenAddressParams<CurveStableRegistry>) {
    return registryContract.get_lp_token(swapAddress);
  }

  async resolveGaugeAddresses({ registryContract, swapAddress }: ResolveGaugeAddressParams<CurveStableRegistry>) {
    return registryContract.get_gauges(swapAddress).then(v => v[0]);
  }
}
