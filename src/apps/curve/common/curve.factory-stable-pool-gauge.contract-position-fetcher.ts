import { CurveStableFactory } from '../contracts';

import {
  CurvePoolGaugeContractPositionFetcher,
  ResolveGaugeAddressParams,
  ResolvePoolCountParams,
  ResolveSwapAddressParams,
  ResolveTokenAddressParams,
} from './curve.pool-gauge.contract-position-fetcher';

export abstract class CurveFactoryStablePoolGaugeContractPositionFetcher extends CurvePoolGaugeContractPositionFetcher<CurveStableFactory> {
  resolveRegistry(address: string): CurveStableFactory {
    return this.contractFactory.curveStableFactory({ address, network: this.network });
  }

  async resolvePoolCount({ registryContract }: ResolvePoolCountParams<CurveStableFactory>) {
    return registryContract.pool_count();
  }

  async resolveSwapAddress({ registryContract, poolIndex }: ResolveSwapAddressParams<CurveStableFactory>) {
    return registryContract.pool_list(poolIndex);
  }

  async resolveTokenAddress({ swapAddress }: ResolveTokenAddressParams<CurveStableFactory>) {
    return swapAddress;
  }

  async resolveGaugeAddresses({ registryContract, swapAddress }: ResolveGaugeAddressParams<CurveStableFactory>) {
    return registryContract.get_gauge(swapAddress).then(v => [v]);
  }
}
