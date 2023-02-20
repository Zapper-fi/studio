import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { UniswapV2PoolOnChainTemplateTokenFetcher } from '~apps/uniswap-v2/common/uniswap-v2.pool.on-chain.template.token-fetcher';

import { UniswapFactory, UniswapPair, UniswapV2ContractFactory } from '../contracts';

export abstract class UniswapV2DefaultPoolOnChainTemplateTokenFetcher extends UniswapV2PoolOnChainTemplateTokenFetcher<
  UniswapPair,
  UniswapFactory
> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(UniswapV2ContractFactory) protected readonly contractFactory: UniswapV2ContractFactory,
  ) {
    super(appToolkit);
  }

  getPoolTokenContract(address: string): UniswapPair {
    return this.contractFactory.uniswapPair({ address, network: this.network });
  }

  getPoolFactoryContract(address: string): UniswapFactory {
    return this.contractFactory.uniswapFactory({ address, network: this.network });
  }

  getPoolsLength(contract: UniswapFactory): Promise<BigNumberish> {
    return contract.allPairsLength();
  }

  getPoolAddress(contract: UniswapFactory, index: number): Promise<string> {
    return contract.allPairs(index);
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
