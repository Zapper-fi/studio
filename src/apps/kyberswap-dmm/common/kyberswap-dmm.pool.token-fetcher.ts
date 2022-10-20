import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { UniswapV2PoolOnChainTemplateTokenFetcher } from '~apps/uniswap-v2/common/uniswap-v2.pool.on-chain.template.token-fetcher';

import { KyberswapDmmContractFactory, KyberSwapDmmFactory, KyberSwapDmmPool } from '../contracts';

export abstract class KyberSwapDmmPoolTokenFetcher extends UniswapV2PoolOnChainTemplateTokenFetcher<
  KyberSwapDmmPool,
  KyberSwapDmmFactory
> {
  fee = 0;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(KyberswapDmmContractFactory) private readonly contractFactory: KyberswapDmmContractFactory,
  ) {
    super(appToolkit);
  }

  getPoolTokenContract(address: string): KyberSwapDmmPool {
    return this.contractFactory.kyberSwapDmmPool({ address, network: this.network });
  }

  getPoolFactoryContract(address: string): KyberSwapDmmFactory {
    return this.contractFactory.kyberSwapDmmFactory({ address, network: this.network });
  }

  getPoolsLength(contract: KyberSwapDmmFactory): Promise<BigNumberish> {
    return contract.allPoolsLength();
  }

  getPoolAddress(contract: KyberSwapDmmFactory, index: number): Promise<string> {
    return contract.allPools(index);
  }

  getPoolToken0(contract: KyberSwapDmmPool): Promise<string> {
    return contract.token0();
  }

  getPoolToken1(contract: KyberSwapDmmPool): Promise<string> {
    return contract.token1();
  }

  getPoolReserves(contract: KyberSwapDmmPool): Promise<BigNumberish[]> {
    return contract.getReserves();
  }
}
