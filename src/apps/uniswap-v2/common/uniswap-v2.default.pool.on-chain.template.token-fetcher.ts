import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { UniswapV2PoolOnChainTemplateTokenFetcher } from '~apps/uniswap-v2/common/uniswap-v2.pool.on-chain.template.token-fetcher';

import { UniswapV2ViemContractFactory } from '../contracts';
import { UniswapFactory, UniswapPair } from '../contracts/viem';

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

  getPoolTokenContract(address: string): UniswapPair {
    return this.contractFactory.uniswapPair({ address, network: this.network });
  }

  getPoolFactoryContract(address: string): UniswapFactory {
    return this.contractFactory.uniswapFactory({ address, network: this.network });
  }

  getPoolsLength(contract: UniswapFactory): Promise<BigNumberish> {
    return contract.read.allPairsLength();
  }

  getPoolAddress(contract: UniswapFactory, index: number): Promise<string> {
    return contract.read.allPairs([index]);
  }

  getPoolToken0(contract: UniswapPair): Promise<string> {
    return contract.read.token0();
  }

  getPoolToken1(contract: UniswapPair): Promise<string> {
    return contract.read.token1();
  }

  getPoolReserves(contract: UniswapPair): Promise<BigNumberish[]> {
    return contract.read.getReserves();
  }
}
