import { Inject } from '@nestjs/common';
import { compact, range, sumBy } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { UniswapV3LiquidityContractPositionBuilder } from '~apps/uniswap-v3/common/uniswap-v3.liquidity.contract-position-builder';
import { UniswapV3LiquidityPositionDataProps } from '~apps/uniswap-v3/common/uniswap-v3.liquidity.contract-position-fetcher';
import { UniswapV3ViemContractFactory } from '~apps/uniswap-v3/contracts';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';

import { RigoblockContractFactory, SmartPool } from '../contracts';

export type UnderlyingLiquidityPositionTokens = {
  address: string;
  balance: number;
  balanceRaw: string;
  balanceUSD: number;
};

export type RigoblockLiquidityDataProps = {
  liquidity: number;
  liquidityPositions: UnderlyingLiquidityPositionTokens[];
};

export type RigoblockPoolAppTokenDefinition = {
  address: string;
  label: string;
  underlyingTokenBalances: ContractPositionBalance<UniswapV3LiquidityPositionDataProps>[];
};

export abstract class RigoblockPoolContractPositionFetcher extends ContractPositionTemplatePositionFetcher<
  SmartPool,
  RigoblockLiquidityDataProps,
  RigoblockPoolAppTokenDefinition
> {
  abstract positionManagerAddress: string;
  abstract groupLabel: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(RigoblockViemContractFactory) protected readonly rigoblockContractFactory: RigoblockViemContractFactory,
    @Inject(UniswapV3ViemContractFactory) protected readonly contractFactory: UniswapV3ViemContractFactory,
    @Inject(UniswapV3LiquidityContractPositionBuilder)
    protected readonly uniswapV3LiquidityContractPositionBuilder: UniswapV3LiquidityContractPositionBuilder,
  ) {
    super(appToolkit);
  }

  getContract(address: string): SmartPool {
    return this.rigoblockContractFactory.smartPool({ address, network: this.network });
  }

  async getDefinitions(): Promise<RigoblockPoolAppTokenDefinition[]> {
    const appTokens = await this.appToolkit.getAppTokenPositions({
      appId: this.appId,
      network: this.network,
      groupIds: ['pool'],
    });

    return await Promise.all(
      appTokens.map(async pool => {
        const underlyingTokenBalances = await this.getUnderlyingBalances(pool.address);
        return {
          address: pool.address,
          label: pool.displayProps.label,
          underlyingTokenBalances: underlyingTokenBalances,
        };
      }),
    );
  }

  // we define the liquidity position of a rigoblock pool
  async getTokenDefinitions({ definition }) {
    return definition.underlyingTokenBalances
      .map(balance => {
        return balance.tokens.map(token => {
          return [
            {
              metaType: MetaType.SUPPLIED,
              address: token.address,
              network: this.network,
            },
          ];
        });
      })
      .flat(2);
  }

  async getDataProps({ definition }): Promise<RigoblockLiquidityDataProps> {
    const liquidityBalances = definition.underlyingTokenBalances;
    const liquidityPositions: UnderlyingLiquidityPositionTokens[] = liquidityBalances
      .map(balance => {
        return balance.tokens.map(token => {
          return {
            address: token.address,
            balance: token.balance,
            balanceRaw: token.balanceRaw,
            balanceUSD: token.balanceUSD,
          };
        });
      })
      .flat(1);
    const liquidity = sumBy(liquidityPositions, v => v.balanceUSD);
    return {
      liquidity: liquidity,
      liquidityPositions: liquidityPositions,
    };
  }

  async getLabel({ definition }) {
    return definition.label;
  }

  async getTokenBalancesPerPosition({ contractPosition }) {
    const { dataProps } = contractPosition;
    return dataProps.liquidityPositions.map(v => v.balanceRaw);
  }

  async getUnderlyingBalances(
    address: string,
  ): Promise<ContractPositionBalance<UniswapV3LiquidityPositionDataProps>[]> {
    // @TODO: Rely on contract positions when we can correctly index all pools
    const multicall = this.appToolkit.getViemMulticall(this.network);
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
