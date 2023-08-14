import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { UniswapV3ContractFactory } from '~apps/uniswap-v3/contracts';
import { UniswapV3LiquidityContractPositionBuilder } from '~apps/uniswap-v3/common/uniswap-v3.liquidity.contract-position-builder';
import { UniswapV3LiquidityContractPositionFetcher } from '~apps/uniswap-v3/common/uniswap-v3.liquidity.contract-position-fetcher';
import { MetaType } from '~position/position.interface';

import { RigoblockContractFactory, SmartPool } from '../contracts';

export type RigoblockPoolAppTokenDefinition = {
  address: string;
  label: string;
};

export abstract class RigoblockPoolContractPositionFetcher extends UniswapV3LiquidityContractPositionFetcher {
  groupLabel: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(RigoblockContractFactory) private readonly rigoblockContractFactory: RigoblockContractFactory,
    @Inject(UniswapV3ContractFactory) protected readonly contractFactory: UniswapV3ContractFactory,
    @Inject(UniswapV3LiquidityContractPositionBuilder)
    protected readonly uniswapV3LiquidityContractPositionBuilder: UniswapV3LiquidityContractPositionBuilder,
  ) {
    super(appToolkit);
  }

  getContract(address: string): SmartPool {
    return this.rigoblockContractFactory.smartPool({ address, network: this.network });
  }

  async getDataProps({
    multicall,
    contractPosition,
  }): Promise {
    const { tokens } = contractPosition;
    return { tokens };
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

  async getLabel({ definition }) {
    return definition.label;
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
}
