import {
  CurvePoolGaugeContractPositionFetcher,
  ResolveGaugeAddressParams,
  ResolvePoolCountParams,
  ResolveSwapAddressParams,
  ResolveTokenAddressParams,
} from '../common/curve.pool-gauge.contract-position-fetcher';
import { CurveCryptoRegistry } from '../contracts/viem';
import { CurveCryptoRegistryContract } from '../contracts/viem/CurveCryptoRegistry';

export abstract class CurveCryptoPoolGaugeContractPositionFetcher extends CurvePoolGaugeContractPositionFetcher<CurveCryptoRegistry> {
  resolveRegistry(address: string): CurveCryptoRegistryContract {
    return this.contractFactory.curveCryptoRegistry({ address, network: this.network });
  }

  async resolvePoolCount({ contract }: ResolvePoolCountParams<CurveCryptoRegistry>) {
    return contract.read.pool_count();
  }

  async resolveSwapAddress({ contract, poolIndex }: ResolveSwapAddressParams<CurveCryptoRegistry>) {
    return contract.read.pool_list([BigInt(poolIndex)]);
  }

  async resolveTokenAddress({ contract, swapAddress }: ResolveTokenAddressParams<CurveCryptoRegistry>) {
    return contract.read.get_lp_token([swapAddress]);
  }

  async resolveGaugeAddresses({ contract, swapAddress }: ResolveGaugeAddressParams<CurveCryptoRegistry>) {
    return contract.read.get_gauges([swapAddress]).then(v => [...v[0]]);
  }
}
