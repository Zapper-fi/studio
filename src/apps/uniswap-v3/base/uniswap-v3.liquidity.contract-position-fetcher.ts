import { Inject, NotImplementedException } from '@nestjs/common';
import { compact, range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { CustomContractPositionTemplatePositionFetcher } from '~position/template/custom-contract-position.template.position-fetcher';

import { UniswapV3ContractFactory, UniswapV3PositionManager } from '../contracts';

import { BaseUniswapV3LiquidityContractPositionBuilder } from './uniswap-v3.liquidity.contract-position-builder';

@PositionTemplate()
export class BaseUniswapV3LiquidityContractPositionFetcher extends CustomContractPositionTemplatePositionFetcher<UniswapV3PositionManager> {
  groupLabel = 'Pools';

  positionManagerAddress = '0x03a520b32c04bf3beef7beb72e919cf822ed34f1';
  factoryAddress = '0x33128a8fc17869897dce68ed026d694621f6fdfd';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(UniswapV3ContractFactory) protected readonly contractFactory: UniswapV3ContractFactory,
    @Inject(BaseUniswapV3LiquidityContractPositionBuilder)
    protected readonly uniswapV3LiquidityContractPositionBuilder: BaseUniswapV3LiquidityContractPositionBuilder,
  ) {
    super(appToolkit);
  }

  getContract(address: string): UniswapV3PositionManager {
    return this.contractFactory.uniswapV3PositionManager({ address, network: this.network });
  }

  async getDefinitions() {
    return [];
  }

  async getTokenDefinitions() {
    return [];
  }

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

  async getBalances(address: string): Promise<ContractPositionBalance[]> {
    // @TODO: Rely on contract positions when we can correctly index all pools
    const multicall = this.appToolkit.getMulticall(this.network);
    const tokenLoader = this.appToolkit.getTokenDependencySelector({
      tags: { network: this.network, context: `${this.appId}__template_balances` },
    });

    const positionManager = this.contractFactory.uniswapV3PositionManager({
      address: this.positionManagerAddress,
      network: this.network,
    });

    const numPositionsRaw = await positionManager.balanceOf(address);
    const balances = await Promise.all(
      range(0, numPositionsRaw.toNumber()).map(async index =>
        this.uniswapV3LiquidityContractPositionBuilder.buildPosition({
          positionId: await multicall.wrap(positionManager).tokenOfOwnerByIndex(address, index),
          network: this.network,
          multicall,
          tokenLoader,
        }),
      ),
    );

    return compact(balances);
  }
}
