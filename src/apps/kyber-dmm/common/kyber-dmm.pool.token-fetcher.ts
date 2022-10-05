import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { UniswapV2PoolOnChainTemplateTokenFetcher } from '~apps/uniswap-v2/common/uniswap-v2.pool.on-chain.template.token-fetcher';

import { KyberDmmContractFactory, KyberDmmFactory, KyberDmmPool } from '../contracts';

export abstract class KyberDmmPoolTokenFetcher extends UniswapV2PoolOnChainTemplateTokenFetcher<
  KyberDmmPool,
  KyberDmmFactory
> {
  fee = 0;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(KyberDmmContractFactory) private readonly contractFactory: KyberDmmContractFactory,
  ) {
    super(appToolkit);
  }

  getPoolTokenContract(address: string): KyberDmmPool {
    return this.contractFactory.kyberDmmPool({ address, network: this.network });
  }

  getPoolFactoryContract(address: string): KyberDmmFactory {
    return this.contractFactory.kyberDmmFactory({ address, network: this.network });
  }

  getPoolsLength(contract: KyberDmmFactory): Promise<BigNumberish> {
    return contract.allPoolsLength();
  }

  getPoolAddress(contract: KyberDmmFactory, index: number): Promise<string> {
    return contract.allPools(index);
  }

  getPoolToken0(contract: KyberDmmPool): Promise<string> {
    return contract.token0();
  }

  getPoolToken1(contract: KyberDmmPool): Promise<string> {
    return contract.token1();
  }

  getPoolReserves(contract: KyberDmmPool): Promise<BigNumberish[]> {
    return contract.getReserves();
  }
}
