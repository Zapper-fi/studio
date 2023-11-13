import { CurveCryptoFactory } from '../contracts/viem';
import { CurveCryptoFactoryContract } from '../contracts/viem/CurveCryptoFactory';

import {
  CurvePoolGaugeContractPositionFetcher,
  ResolveGaugeAddressParams,
  ResolvePoolCountParams,
  ResolveSwapAddressParams,
  ResolveTokenAddressParams,
} from './curve.pool-gauge.contract-position-fetcher';

export abstract class CurveFactoryCryptoPoolGaugeContractPositionFetcher extends CurvePoolGaugeContractPositionFetcher<CurveCryptoFactory> {
  resolveRegistry(address: string): CurveCryptoFactoryContract {
    return this.contractFactory.curveCryptoFactory({ address, network: this.network });
  }

  async resolvePoolCount({ contract }: ResolvePoolCountParams<CurveCryptoFactory>) {
    return contract.read.pool_count();
  }

  async resolveSwapAddress({ contract, poolIndex }: ResolveSwapAddressParams<CurveCryptoFactory>) {
    return contract.read.pool_list([BigInt(poolIndex)]);
  }

  async resolveTokenAddress({ contract, swapAddress }: ResolveTokenAddressParams<CurveCryptoFactory>) {
    return contract.read.get_token([swapAddress]);
  }

  async resolveGaugeAddresses({ contract, swapAddress }: ResolveGaugeAddressParams<CurveCryptoFactory>) {
    return contract.read.get_gauge([swapAddress]).then(v => [v]);
  }
}
