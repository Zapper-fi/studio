import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';

import { UniswapV2ViemContractFactory } from '../contracts';
import { UniswapPair } from '../contracts/viem';
import { UniswapPairContract } from '../contracts/viem/UniswapPair';

import { UniswapV2PoolSubgraphTemplateTokenFetcher } from './uniswap-v2.pool.subgraph.template.token-fetcher';

export abstract class UniswapV2DefaultPoolSubgraphTemplateTokenFetcher extends UniswapV2PoolSubgraphTemplateTokenFetcher<UniswapPair> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(UniswapV2ViemContractFactory) protected readonly contractFactory: UniswapV2ViemContractFactory,
  ) {
    super(appToolkit);
  }

  getPoolTokenContract(address: string): UniswapPairContract {
    return this.contractFactory.uniswapPair({ address, network: this.network });
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
