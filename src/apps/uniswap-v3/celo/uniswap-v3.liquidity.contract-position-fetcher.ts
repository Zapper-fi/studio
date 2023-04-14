import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { UniswapV3LiquidityContractPositionBuilder } from '../common/uniswap-v3.liquidity.contract-position-builder';
import { UniswapV3LiquidityContractPositionFetcher } from '../common/uniswap-v3.liquidity.contract-position-fetcher';
import { UniswapV3ContractFactory } from '../contracts';

import { CeloUniswapV3LiquidityContractPositionBuilder } from './uniswap-v3.liquidity.contract-position-builder';

@PositionTemplate()
export class CeloUniswapV3LiquidityContractPositionFetcher extends UniswapV3LiquidityContractPositionFetcher {
  groupLabel = 'Pools';

  subgraphUrl = 'https://api.thegraph.com/subgraphs/name/jesse-sawa/uniswap-celo';
  positionManagerAddress = '0x3d79edaabc0eab6f08ed885c05fc0b014290d95a';
  factoryAddress = '0xafe208a311b21f13ef87e33a90049fc17a7acdec';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(UniswapV3ContractFactory) protected readonly contractFactory: UniswapV3ContractFactory,
    @Inject(CeloUniswapV3LiquidityContractPositionBuilder)
    protected readonly uniswapV3LiquidityContractPositionBuilder: UniswapV3LiquidityContractPositionBuilder,
  ) {
    super(appToolkit, contractFactory, uniswapV3LiquidityContractPositionBuilder);
  }
}
