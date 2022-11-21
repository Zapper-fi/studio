import {
  CurvePoolGaugeContractPositionFetcher,
  ResolveGaugeAddressParams,
  ResolvePoolCountParams,
  ResolveSwapAddressParams,
  ResolveTokenAddressParams,
} from '../common/curve.pool-gauge.contract-position-fetcher';
import { CurveCryptoRegistry } from '../contracts';

export abstract class CurveCryptoPoolGaugeContractPositionFetcher extends CurvePoolGaugeContractPositionFetcher<CurveCryptoRegistry> {
  resolveRegistry(address: string): CurveCryptoRegistry {
    return this.contractFactory.curveCryptoRegistry({ address, network: this.network });
  }

  async resolvePoolCount({ registryContract }: ResolvePoolCountParams<CurveCryptoRegistry>) {
    return registryContract.pool_count();
  }

  async resolveSwapAddress({ registryContract, poolIndex }: ResolveSwapAddressParams<CurveCryptoRegistry>) {
    return registryContract.pool_list(poolIndex);
  }

  async resolveTokenAddress({ registryContract, swapAddress }: ResolveTokenAddressParams<CurveCryptoRegistry>) {
    return registryContract.get_lp_token(swapAddress);
  }

  async resolveGaugeAddresses({ registryContract, swapAddress }: ResolveGaugeAddressParams<CurveCryptoRegistry>) {
    return registryContract.get_gauges(swapAddress).then(v => v[0]);
  }
}
