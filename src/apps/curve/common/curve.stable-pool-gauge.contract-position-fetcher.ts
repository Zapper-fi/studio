import {
  CurvePoolGaugeContractPositionFetcher,
  ResolveGaugeAddressParams,
  ResolvePoolCountParams,
  ResolveSwapAddressParams,
  ResolveTokenAddressParams,
} from '../common/curve.pool-gauge.contract-position-fetcher';
import { CurveStableRegistry } from '../contracts/viem';
import { CurveStableRegistryContract } from '../contracts/viem/CurveStableRegistry';

export abstract class CurveStablePoolGaugeContractPositionFetcher extends CurvePoolGaugeContractPositionFetcher<CurveStableRegistry> {
  resolveRegistry(address: string): CurveStableRegistryContract {
    return this.contractFactory.curveStableRegistry({ address, network: this.network });
  }

  async resolvePoolCount({ contract }: ResolvePoolCountParams<CurveStableRegistry>) {
    return contract.read.pool_count();
  }

  async resolveSwapAddress({ contract, poolIndex }: ResolveSwapAddressParams<CurveStableRegistry>) {
    return contract.read.pool_list([BigInt(poolIndex)]);
  }

  async resolveTokenAddress({ contract, swapAddress }: ResolveTokenAddressParams<CurveStableRegistry>) {
    return contract.read.get_lp_token([swapAddress]);
  }

  async resolveGaugeAddresses({ contract, swapAddress }: ResolveGaugeAddressParams<CurveStableRegistry>) {
    return contract.read.get_gauges([swapAddress]).then(v => [...v[0]]);
  }
}
