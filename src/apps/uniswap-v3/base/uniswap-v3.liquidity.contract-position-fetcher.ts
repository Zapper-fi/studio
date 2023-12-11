import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { UniswapV3LiquidityContractPositionBuilder } from '../common/uniswap-v3.liquidity.contract-position-builder';
import { UniswapV3LiquidityContractPositionFetcher } from '../common/uniswap-v3.liquidity.contract-position-fetcher';
import { UniswapV3ViemContractFactory } from '../contracts';

import { BaseUniswapV3LiquidityContractPositionBuilder } from './uniswap-v3.liquidity.contract-position-builder';

@PositionTemplate()
export class BaseUniswapV3LiquidityContractPositionFetcher extends UniswapV3LiquidityContractPositionFetcher {
  groupLabel = 'Pools';

  subgraphUrl = 'https://api.studio.thegraph.com/query/48211/uniswap-v3-base/v0.0.1';
  positionManagerAddress = '0x03a520b32c04bf3beef7beb72e919cf822ed34f1';
  factoryAddress = '0x33128a8fc17869897dce68ed026d694621f6fdfd';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(UniswapV3ViemContractFactory) protected readonly contractFactory: UniswapV3ViemContractFactory,
    @Inject(BaseUniswapV3LiquidityContractPositionBuilder)
    protected readonly uniswapV3LiquidityContractPositionBuilder: UniswapV3LiquidityContractPositionBuilder,
  ) {
    super(appToolkit, contractFactory, uniswapV3LiquidityContractPositionBuilder);
  }
}
