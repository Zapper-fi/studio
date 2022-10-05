import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';

import { UniswapPair, UniswapV2ContractFactory } from '../contracts';

import { UniswapV2PoolSubgraphTemplateTokenFetcher } from './uniswap-v2.pool.subgraph.template.token-fetcher';

export abstract class UniswapV2DefaultPoolSubgraphTemplateTokenFetcher extends UniswapV2PoolSubgraphTemplateTokenFetcher<UniswapPair> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(UniswapV2ContractFactory) protected readonly contractFactory: UniswapV2ContractFactory,
  ) {
    super(appToolkit);
  }

  getPoolTokenContract(address: string): UniswapPair {
    return this.contractFactory.uniswapPair({ address, network: this.network });
  }

  getPoolToken0(contract: UniswapPair): Promise<string> {
    return contract.token0();
  }

  getPoolToken1(contract: UniswapPair): Promise<string> {
    return contract.token1();
  }

  getPoolReserves(contract: UniswapPair): Promise<BigNumberish[]> {
    return contract.getReserves();
  }
}
