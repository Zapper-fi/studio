import { Inject, NotImplementedException } from '@nestjs/common';
import { compact, range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { UniswapV3LiquidityContractPositionFetcher } from '../common/uniswap-v3.liquidity.contract-position-fetcher';
import { UniswapV3ViemContractFactory } from '../contracts';

import { BaseUniswapV3LiquidityContractPositionBuilder } from './uniswap-v3.liquidity.contract-position-builder';

@PositionTemplate()
export class BaseUniswapV3LiquidityContractPositionFetcher extends UniswapV3LiquidityContractPositionFetcher {
  groupLabel = 'Pools';

  subgraphUrl = '';
  positionManagerAddress = '0x03a520b32c04bf3beef7beb72e919cf822ed34f1';
  factoryAddress = '0x33128a8fc17869897dce68ed026d694621f6fdfd';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(UniswapV3ViemContractFactory) protected readonly contractFactory: UniswapV3ViemContractFactory,
    @Inject(BaseUniswapV3LiquidityContractPositionBuilder)
    protected readonly uniswapV3LiquidityContractPositionBuilder: BaseUniswapV3LiquidityContractPositionBuilder,
  ) {
    super(appToolkit, contractFactory, uniswapV3LiquidityContractPositionBuilder);
  }

  getContract(address: string) {
    return this.contractFactory.uniswapV3PositionManager({ address, network: this.network });
  }

  async getDefinitions() {
    return [];
  }

  async getTokenDefinitions() {
    return [];
  }

  // @ts-ignore
  async getDataProps() {
    return {};
  }

  async getLabel() {
    return '';
  }

  // @ts-ignore
  async getTokenBalancesPerPosition() {
    throw new NotImplementedException();
  }

  async getBalances(address: string) {
    // @TODO: Rely on contract positions when we can correctly index all pools
    const multicall = this.appToolkit.getViemMulticall(this.network);
    const tokenLoader = this.appToolkit.getTokenDependencySelector({
      tags: { network: this.network, context: `${this.appId}__template_balances` },
    });

    const positionManager = this.contractFactory.uniswapV3PositionManager({
      address: this.positionManagerAddress,
      network: this.network,
    });

    const numPositionsRaw = await positionManager.read.balanceOf([address]);
    const balances = await Promise.all(
      range(0, Number(numPositionsRaw)).map(async index =>
        this.uniswapV3LiquidityContractPositionBuilder.buildPosition({
          positionId: await multicall.wrap(positionManager).read.tokenOfOwnerByIndex([address, BigInt(index)]),
          network: this.network,
          multicall,
          tokenLoader,
        }),
      ),
    );

    return compact(balances);
  }
}
