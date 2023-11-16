import { CurveTricryptoFactory } from '../contracts/viem';
import { CurveTricryptoFactoryContract } from '../contracts/viem/CurveTricryptoFactory';

import {
  CurvePoolGaugeV6ContractPositionFetcher,
  ResolveGaugeAddressParams,
  ResolvePoolCountParams,
  ResolveTokenAddressParams,
} from './curve.pool-gauge-v6.contract-position-fetcher';

export abstract class CurveTricryptoPoolGaugeContractPositionFetcher extends CurvePoolGaugeV6ContractPositionFetcher<CurveTricryptoFactory> {
  resolveFactory(address: string): CurveTricryptoFactoryContract {
    return this.contractFactory.curveTricryptoFactory({ address, network: this.network });
  }

  async resolvePoolCount({ contract }: ResolvePoolCountParams<CurveTricryptoFactory>) {
    return contract.read.pool_count();
  }

  async resolveTokenAddress({ contract, poolIndex }: ResolveTokenAddressParams<CurveTricryptoFactory>) {
    return contract.read.pool_list([BigInt(poolIndex)]);
  }

  async resolveGaugeAddress({ contract, tokenAddress }: ResolveGaugeAddressParams<CurveTricryptoFactory>) {
    return contract.read.get_gauge([tokenAddress]);
  }
}
