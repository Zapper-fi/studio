import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';
import { compact, range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { UniswapV3ContractFactory } from '~apps/uniswap-v3/contracts';
import { UniswapV3LiquidityContractPositionBuilder } from '~apps/uniswap-v3/common/uniswap-v3.liquidity.contract-position-builder';
import { UniswapV3LiquidityPositionDataProps } from '~apps/uniswap-v3/common/uniswap-v3.liquidity.contract-position-fetcher';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { MetaType } from '~position/position.interface';
import { GetDataPropsParams } from '~position/template/contract-position.template.types';
import { CustomContractPositionTemplatePositionFetcher } from '~position/template/custom-contract-position.template.position-fetcher';
import { RigoblockContractFactory, SmartPool } from '../contracts';

export type UnderlyingLiquidityPositionTokens = {
  address: string;
  balance: number;
  balanceRaw: string;
  balanceUSD: number;
}

export type RigoblockLiquidityDataProps = {
  liquidityPositions: UnderlyingLiquidityPositionTokens[];
};

export type RigoblockPoolAppTokenDefinition = {
  address: string;
  label: string;
};

export abstract class RigoblockPoolContractPositionFetcher extends CustomContractPositionTemplatePositionFetcher<
  SmartPool,
  RigoblockLiquidityDataProps
> {
  abstract positionManagerAddress: string;
  abstract groupLabel: string;

  appId = 'rigoblock';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(RigoblockContractFactory) protected readonly rigoblockContractFactory: RigoblockContractFactory,
    @Inject(UniswapV3ContractFactory) protected readonly contractFactory: UniswapV3ContractFactory,
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

    return appTokens.map(pool => {
      return {
        address: pool.address,
        label: pool.displayProps.label,
      };
    });
  }

  async getDataProps({ contractPosition }) /*: GetDataPropsParams<
    RigoblockLiquidityDataProps
  >): Promise<RigoblockLiquidityDataProps>*/ {
    const liquidityBalances = await this.getBalances(contractPosition.address);
    const liquidityPositions: UnderlyingLiquidityPositionTokens[] = liquidityBalances.map(balance => {
      return balance.tokens.map(token => {
        return {
          address: token.address,
          balance: token.balance,
          balanceRaw: token.balanceRaw,
          balanceUSD: token.balanceUSD,
        };
      });
    }).flat(1);
    return { liquidityPositions: liquidityPositions };
  }

  async getLabel({ definition }) {
    return definition.label;
  }

  // @ts-ignore
  async getTokenBalancesPerPosition({ address }) {
    const underlyingTokenBalances = await this.getBalances(address);
    return underlyingTokenBalances.map(balance => {
      const tokens = balance.tokens;
      return tokens.map(token => {
        return token.balanceRaw;
      });
    }).flat(2);
  }

  // we defined the liquidity position of a rigoblock pool
  async getTokenDefinitions({ definition }) {
    const underlyingTokenBalances = await this.getBalances(definition.address);
    return underlyingTokenBalances.map(balance => {
      const tokens = balance.tokens;
      return tokens.map(token => {
        return [
          {
            metaType: MetaType.SUPPLIED,
            address: token.address,
            network: this.network,
          },
        ];
      });
    }).flat(2);
  }

  async getBalances(address: string): Promise<ContractPositionBalance<UniswapV3LiquidityPositionDataProps>[]> {
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
