import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import {
  UniswapV2PoolOnChainTemplateTokenFetcher,
  UniswapV2TokenDataProps,
} from '~apps/uniswap-v2/common/uniswap-v2.pool.on-chain.template.token-fetcher';
import { UniswapV2ViemContractFactory } from '~apps/uniswap-v2/contracts';
import { UniswapPair, UniswapFactory } from '~apps/uniswap-v2/contracts/viem';
import { UniswapFactoryContract } from '~apps/uniswap-v2/contracts/viem/UniswapFactory';
import { UniswapPairContract } from '~apps/uniswap-v2/contracts/viem/UniswapPair';
import { DollarDisplayItem, PercentageDisplayItem } from '~position/display.interface';
import { GetDisplayPropsParams, DefaultAppTokenDefinition } from '~position/template/app-token.template.types';

@PositionTemplate()
export class ArbitrumRamsesPoolTokenFetcher extends UniswapV2PoolOnChainTemplateTokenFetcher<
  UniswapPair,
  UniswapFactory
> {
  factoryAddress = '0xaaa20d08e59f6561f242b08513d36266c5a29415';
  groupLabel = 'Stable Pools';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(UniswapV2ViemContractFactory) protected readonly contractFactory: UniswapV2ViemContractFactory,
  ) {
    super(appToolkit);
  }

  getPoolTokenContract(address: string) {
    return this.contractFactory.uniswapPair({ address, network: this.network });
  }

  getPoolFactoryContract(_address: string) {
    return this.contractFactory.uniswapFactory({ address: this.factoryAddress, network: this.network });
  }

  async getPoolsLength(contract: UniswapFactoryContract): Promise<BigNumberish> {
    return contract.read.allPairsLength();
  }

  async getPoolAddress(contract: UniswapFactoryContract, index: number): Promise<string> {
    return contract.read.allPairs([BigInt(index)]);
  }

  async getPoolToken0(contract: UniswapPairContract) {
    return contract.read.token0();
  }

  async getPoolToken1(contract: UniswapPairContract) {
    return contract.read.token1();
  }

  async getPoolReserves(contract: UniswapPairContract) {
    const [reserve0, reserve1] = await contract.read.getReserves();
    return [reserve0, reserve1];
  }

  async getTertiaryLabel({
    appToken,
  }: GetDisplayPropsParams<UniswapPair, UniswapV2TokenDataProps, DefaultAppTokenDefinition>): Promise<
    string | number | PercentageDisplayItem | DollarDisplayItem | undefined
  > {
    const isCorrelated = appToken.symbol.startsWith('crAMM');
    const isVolatile = appToken.symbol.startsWith('vrAMM');

    if (isCorrelated) return 'Correlated';
    if (isVolatile) return 'Volatile';
    return '';
  }
}
