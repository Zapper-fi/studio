import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { UniswapV2PoolOnChainTemplateTokenFetcher } from '~apps/uniswap-v2/common/uniswap-v2.pool.on-chain.template.token-fetcher';

import { KyberswapClassicViemContractFactory } from '../contracts';
import { KyberSwapClassicFactory, KyberSwapClassicPool } from '../contracts/viem';
import { KyberSwapClassicFactoryContract } from '../contracts/viem/KyberSwapClassicFactory';
import { KyberSwapClassicPoolContract } from '../contracts/viem/KyberSwapClassicPool';

export abstract class KyberSwapClassicPoolTokenFetcher extends UniswapV2PoolOnChainTemplateTokenFetcher<
  KyberSwapClassicPool,
  KyberSwapClassicFactory
> {
  fee = 0;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(KyberswapClassicViemContractFactory) private readonly contractFactory: KyberswapClassicViemContractFactory,
  ) {
    super(appToolkit);
  }

  getPoolTokenContract(address: string): KyberSwapClassicPoolContract {
    return this.contractFactory.kyberSwapClassicPool({ address, network: this.network });
  }

  getPoolFactoryContract(address: string): KyberSwapClassicFactoryContract {
    return this.contractFactory.kyberSwapClassicFactory({ address, network: this.network });
  }

  getPoolsLength(contract: KyberSwapClassicFactoryContract): Promise<BigNumberish> {
    return contract.read.allPoolsLength();
  }

  getPoolAddress(contract: KyberSwapClassicFactoryContract, index: number): Promise<string> {
    return contract.read.allPools([BigInt(index)]);
  }

  getPoolToken0(contract: KyberSwapClassicPoolContract): Promise<string> {
    return contract.read.token0();
  }

  getPoolToken1(contract: KyberSwapClassicPoolContract): Promise<string> {
    return contract.read.token1();
  }

  async getPoolReserves(contract: KyberSwapClassicPoolContract): Promise<BigNumberish[]> {
    const reserves = await contract.read.getReserves();
    return [reserves[0], reserves[1]];
  }
}
