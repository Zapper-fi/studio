import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { UniswapV2PoolOnChainTemplateTokenFetcher } from '~apps/uniswap-v2/common/uniswap-v2.pool.on-chain.template.token-fetcher';

import { UniswapV2ViemContractFactory } from '../contracts';
import { UniswapFactory, UniswapPair } from '../contracts/viem';
import { UniswapFactoryContract } from '../contracts/viem/UniswapFactory';
import { UniswapPairContract } from '../contracts/viem/UniswapPair';

export abstract class UniswapV2DefaultPoolOnChainTemplateTokenFetcher extends UniswapV2PoolOnChainTemplateTokenFetcher<
  UniswapPair,
  UniswapFactory
> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(UniswapV2ViemContractFactory) protected readonly contractFactory: UniswapV2ViemContractFactory,
  ) {
    super(appToolkit);
  }

  getPoolTokenContract(address: string): UniswapPairContract {
    return this.contractFactory.uniswapPair({ address, network: this.network });
  }

  getPoolFactoryContract(address: string): UniswapFactoryContract {
    return this.contractFactory.uniswapFactory({ address, network: this.network });
  }

  getPoolsLength(contract: UniswapFactoryContract): Promise<BigNumberish> {
    return contract.read.allPairsLength();
  }

  getPoolAddress(contract: UniswapFactoryContract, index: number): Promise<string> {
    return contract.read.allPairs([BigInt(index)]);
  }

  getPoolToken0(contract: UniswapPairContract): Promise<string> {
    return contract.read.token0();
  }

  getPoolToken1(contract: UniswapPairContract): Promise<string> {
    return contract.read.token1();
  }

  async getPoolReserves(contract: UniswapPairContract): Promise<BigNumberish[]> {
    const reserves = await contract.read.getReserves();
    return [reserves[0], reserves[1]];
  }
}
