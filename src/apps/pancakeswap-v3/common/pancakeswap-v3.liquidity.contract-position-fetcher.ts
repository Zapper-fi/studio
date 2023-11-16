import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import { gql } from 'graphql-request';
import { compact, range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { gqlFetch } from '~app-toolkit/helpers/the-graph.helper';
import { DefaultDataProps } from '~position/display.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { MetaType, Standard } from '~position/position.interface';
import {
  GetDefinitionsParams,
  GetTokenDefinitionsParams,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetDataPropsParams,
} from '~position/template/contract-position.template.types';
import { CustomContractPositionTemplatePositionFetcher } from '~position/template/custom-contract-position.template.position-fetcher';
import { Network } from '~types';

import { PancakeswapV3ViemContractFactory } from '../contracts';
import { PancakeswapNfPositionManager } from '../contracts/viem';

import { PancakeswapV3LiquidityContractPositionBuilder } from './pancakeswap-v3.liquidity.contract-position-builder';

/**
  https://docs.pancakeswap.finance/developers/smart-contracts/pancakeswap-exchange/v3-contracts/nonfungiblepositionmanager
  
  uint96 nonce;
  address operator;
  uint80 poolId;
  int24 tickLower;
  int24 tickUpper;
  uint128 liquidity;
  uint256 feeGrowthInside0LastX128;
  uint256 feeGrowthInside1LastX128;
  uint128 tokensOwed0;
  uint128 tokensOwed1;

 */
export type NonFungiblePancakeswapV3Position = {
  nonce: number;
  operator: string;
  poolId: number;
  tickLower: number;
  tickUpper: number;
  liquidity: number;
  feeGrowthInside0LastX128: number;
  feeGrowthInside1LastX128: number;
  tokenOwed0: number;
  tokenOwed1: number;
};

type NonFungiblePancakeswapV3PositionDefinition = {
  address: string;
  poolAddress: string;
  token0Address: string;
  token1Address: string;
  feeTier: number;
};

export type NonFungiblePancakeswapV3PositionDataProps = {
  feeTier: number;
  liquidity: number;
  reserves: number[];
  poolAddress: string;
  assetStandard: Standard.ERC_721;
  rangeStart?: number;
  rangeEnd?: number;
  positionKey: string;
};

type TopPoolsResponse = {
  pools: Array<{
    id: string;
    feeTier: string;
    token0: {
      id: string;
    };
    token1: {
      id: string;
    };
  }>;
};

const query = gql`
  query topPools {
    pools(first: 50, orderBy: totalValueLockedUSD, orderDirection: desc, subgraphError: allow) {
      id
      feeTier
      token0 {
        id
      }
      token1 {
        id
      }
    }
  }
`;

export abstract class BinanceSmartChainPancakeswapV3LiquidityContractPositionFetcher extends CustomContractPositionTemplatePositionFetcher<
  PancakeswapNfPositionManager,
  NonFungiblePancakeswapV3PositionDataProps,
  NonFungiblePancakeswapV3PositionDefinition
> {
  groupLabel: string;

  abstract subgraphUrl: string;
  abstract positionManagerAddress: string;
  abstract factoryAddress: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PancakeswapV3ViemContractFactory)
    protected readonly pancakeswapV3ContractFactory: PancakeswapV3ViemContractFactory,
    @Inject(PancakeswapV3LiquidityContractPositionBuilder)
    protected readonly pancakeswapV3LiquidityContractPositionBuilder: PancakeswapV3LiquidityContractPositionBuilder,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.pancakeswapV3ContractFactory.pancakeswapNfPositionManager({
      address,
      network: Network.BINANCE_SMART_CHAIN_MAINNET,
    });
  }

  async getDefinitions(_params: GetDefinitionsParams): Promise<NonFungiblePancakeswapV3PositionDefinition[]> {
    const data = await gqlFetch<TopPoolsResponse>({
      endpoint: this.subgraphUrl,
      query: query,
    });

    return data.pools.map(v => ({
      address: this.positionManagerAddress,
      poolAddress: v.id.toLowerCase(),
      token0Address: v.token0.id.toLowerCase(),
      token1Address: v.token1.id.toLowerCase(),
      feeTier: Number(v.feeTier) / 10 ** 4,
    }));
  }

  async getTokenDefinitions({
    definition,
  }: GetTokenDefinitionsParams<PancakeswapNfPositionManager, NonFungiblePancakeswapV3PositionDefinition>) {
    return [
      {
        metaType: MetaType.SUPPLIED,
        address: definition.token0Address,
        network: this.network,
      },
      {
        metaType: MetaType.SUPPLIED,
        address: definition.token1Address,
        network: this.network,
      },
    ];
  }

  async getDataProps({
    multicall,
    contractPosition,
    definition,
  }: GetDataPropsParams<
    PancakeswapNfPositionManager,
    NonFungiblePancakeswapV3PositionDataProps,
    NonFungiblePancakeswapV3PositionDefinition
  >): Promise<NonFungiblePancakeswapV3PositionDataProps> {
    const { poolAddress, feeTier } = definition;
    const { tokens } = contractPosition;

    const [reserveRaw0, reserveRaw1] = await Promise.all([
      multicall.wrap(this.appToolkit.globalViemContracts.erc20(tokens[0])).read.balanceOf([poolAddress]),
      multicall.wrap(this.appToolkit.globalViemContracts.erc20(tokens[1])).read.balanceOf([poolAddress]),
    ]);

    const reservesRaw = [reserveRaw0, reserveRaw1];
    const reserves = reservesRaw.map((r, i) => Number(r) / 10 ** tokens[i].decimals);
    const liquidity = reserves[0] * tokens[0].price + reserves[1] * tokens[1].price;
    const assetStandard = Standard.ERC_721;

    return { feeTier, reserves, liquidity, poolAddress, assetStandard, positionKey: `${feeTier}` };
  }

  async getLabel({
    contractPosition,
    definition,
  }: GetDisplayPropsParams<
    PancakeswapNfPositionManager,
    NonFungiblePancakeswapV3PositionDataProps,
    NonFungiblePancakeswapV3PositionDefinition
  >): Promise<string> {
    const symbolLabel = contractPosition.tokens.map(t => getLabelFromToken(t)).join(' / ');
    const label = `${symbolLabel} (${definition.feeTier.toFixed(2)}%)`;
    return label;
  }

  getTokenBalancesPerPosition(
    _params: GetTokenBalancesParams<PancakeswapNfPositionManager, DefaultDataProps>,
  ): Promise<BigNumberish[]> {
    throw new Error('Method not implemented.');
  }

  async getBalances(address: string): Promise<ContractPositionBalance<NonFungiblePancakeswapV3PositionDataProps>[]> {
    const multicall = this.appToolkit.getViemMulticall(this.network);

    const tokenLoader = this.appToolkit.getTokenDependencySelector({
      tags: { network: this.network, context: `${this.appId}__template_balances` },
    });

    const positionManager = this.pancakeswapV3ContractFactory.pancakeswapNfPositionManager({
      address: this.positionManagerAddress,
      network: this.network,
    });

    const numPositionsRaw = await positionManager.read.balanceOf([address]);

    const balances = await Promise.all(
      range(0, Number(numPositionsRaw)).map(async index =>
        this.pancakeswapV3LiquidityContractPositionBuilder.buildPosition({
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
