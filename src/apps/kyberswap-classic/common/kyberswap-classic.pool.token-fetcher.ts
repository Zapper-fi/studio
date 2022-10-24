import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { UniswapV2PoolOnChainTemplateTokenFetcher } from '~apps/uniswap-v2/common/uniswap-v2.pool.on-chain.template.token-fetcher';

import { KyberswapClassicContractFactory, KyberSwapClassicFactory, KyberSwapClassicPool } from '../contracts';

export abstract class KyberSwapClassicPoolTokenFetcher extends UniswapV2PoolOnChainTemplateTokenFetcher<
  KyberSwapClassicPool,
  KyberSwapClassicFactory
> {
  fee = 0;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(KyberswapClassicContractFactory) private readonly contractFactory: KyberswapClassicContractFactory,
  ) {
    super(appToolkit);
  }

  getPoolTokenContract(address: string): KyberSwapClassicPool {
    return this.contractFactory.kyberSwapClassicPool({ address, network: this.network });
  }

  getPoolFactoryContract(address: string): KyberSwapClassicFactory {
    return this.contractFactory.kyberSwapClassicFactory({ address, network: this.network });
  }

  getPoolsLength(contract: KyberSwapClassicFactory): Promise<BigNumberish> {
    return contract.allPoolsLength();
  }

  getPoolAddress(contract: KyberSwapClassicFactory, index: number): Promise<string> {
    return contract.allPools(index);
  }

  getPoolToken0(contract: KyberSwapClassicPool): Promise<string> {
    return contract.token0();
  }

  getPoolToken1(contract: KyberSwapClassicPool): Promise<string> {
    return contract.token1();
  }

  getPoolReserves(contract: KyberSwapClassicPool): Promise<BigNumberish[]> {
    return contract.getReserves();
  }
}
