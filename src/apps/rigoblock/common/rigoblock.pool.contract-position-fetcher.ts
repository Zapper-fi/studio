import { Inject, NotImplementedException } from '@nestjs/common';
import { compact, range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { UniswapV3ContractFactory } from '~apps/uniswap-v3/contracts';
import { UniswapV3LiquidityContractPositionBuilder } from '~apps/uniswap-v3/common/uniswap-v3.liquidity.contract-position-builder';
import { UniswapV3LiquidityContractPositionFetcher } from '~apps/uniswap-v3/common/uniswap-v3.liquidity.contract-position-fetcher';
import { MetaType } from '~position/position.interface';

import { RigoblockContractFactory, SmartPool } from '../contracts';

export type RigoblockPoolAppTokenDefinition = {
  address: string;
};

export abstract class RigoblockPoolContractPositionFetcher extends UniswapV3LiquidityContractPositionFetcher {
  groupLabel: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(RigoblockContractFactory) private readonly contractFactory: RigoblockContractFactory,
    @Inject(UniswapV3ContractFactory) protected readonly uniswapContractFactory: UniswapV3ContractFactory,
    @Inject(UniswapV3LiquidityContractPositionBuilder)
    protected readonly uniswapV3LiquidityContractPositionBuilder: UniswapV3LiquidityContractPositionBuilder,
  ) {
    super(appToolkit);
  }

  getContract(address: string): SmartPool {
    return this.contractFactory.smartPool({ address, network: this.network });
  }

  getPositionManager() {
    return this.uniswapContractFactory.uniswapV3PositionManager({ address: this.positionManagerAddress, network: this.network });
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
      };
    });
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

  async getDataProps({
    multicall,
    contractPosition,
  }): Promise {
    const { tokens } = contractPosition;
    return { tokens };
  }

  async getLabel({ contractPosition }) {
    return contractPosition.tokens.map(t => getLabelFromToken(t)).join(' / ');
  }

  async getTokenBalancesPerPosition() {
    throw new NotImplementedException();
  }

  // TODO: check if by renaming injected definitions we can avoid having to override this method
  async getBalances(address: string): Promise<ContractPositionBalance<UniswapV3LiquidityPositionDataProps>[]> {
    // @TODO: Rely on contract positions when we can correctly index all pools
    const multicall = this.appToolkit.getMulticall(this.network);
    const tokenLoader = this.appToolkit.getTokenDependencySelector({
      tags: { network: this.network, context: `${this.appId}__template_balances` },
    });

    const positionManager = this.getPositionManager();
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
