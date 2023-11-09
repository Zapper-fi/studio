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

  async resolvePoolCount({ contract }: ResolvePoolCountParams<CurveStableFactory>) {
    return contract.read.pool_count();
  }

  async resolveSwapAddress({ contract, poolIndex }: ResolveSwapAddressParams<CurveStableFactory>) {
    return contract.read.pool_list([poolIndex]);
  }

  async resolveTokenAddress({ swapAddress }: ResolveTokenAddressParams<CurveStableFactory>) {
    return swapAddress;
  }

  async resolveGaugeAddresses({ contract, swapAddress }: ResolveGaugeAddressParams<CurveStableFactory>) {
    return contract.read.get_gauge([swapAddress]).then(v => [v]);
  }
}
