import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import {
  UniswapV2PoolOnChainTemplateTokenFetcher,
  UniswapV2TokenDataProps,
} from '~apps/uniswap-v2/common/uniswap-v2.pool.on-chain.template.token-fetcher';
import { UniswapPair, UniswapFactory, UniswapV2ContractFactory } from '~apps/uniswap-v2/contracts';
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
    @Inject(UniswapV2ContractFactory) protected readonly contractFactory: UniswapV2ContractFactory,
  ) {
    super(appToolkit);
  }

  getPoolTokenContract(address: string): UniswapPair {
    return this.contractFactory.uniswapPair({ address, network: this.network });
  }

  getPoolFactoryContract(_address: string): UniswapFactory {
    return this.contractFactory.uniswapFactory({ address: this.factoryAddress, network: this.network });
  }

  async getPoolsLength(contract: UniswapFactory): Promise<BigNumberish> {
    return contract.allPairsLength();
  }

  async getPoolAddress(contract: UniswapFactory, index: number): Promise<string> {
    return contract.allPairs(index);
  }

  async getPoolToken0(contract: UniswapPair) {
    return contract.token0();
  }

  async getPoolToken1(contract: UniswapPair) {
    return contract.token1();
  }

  async getPoolReserves(contract: UniswapPair) {
    return contract.getReserves();
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
