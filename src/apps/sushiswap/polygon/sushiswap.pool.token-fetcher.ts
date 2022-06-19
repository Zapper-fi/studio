import { Inject } from '@nestjs/common';
import { gql } from 'graphql-request';

import { Register } from '~app-toolkit/decorators';
import {
  UniswapFactory,
  UniswapPair,
  UniswapV2ContractFactory,
  UniswapV2PoolTokenHelper,
  UniswapV2TheGraphPoolTokenAddressStrategy,
  UniswapV2TheGraphPoolVolumeStrategy,
} from '~apps/uniswap-v2';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { SUSHISWAP_DEFINITION } from '../sushiswap.definition';

const POOL_ADDRESSES_QUERY = gql`
  query getPools($first: Int) {
    pairs(first: $first, skip: 0, orderBy: reserveETH, orderDirection: desc) {
      id
    }
  }
`;

const POOL_VOLUMES_QUERY = gql`
  query getCurrentPairVolumes($first: Int) {
    pairs(first: $first, skip: 0, orderBy: reserveETH, orderDirection: desc) {
      id
      volumeUSD
      untrackedVolumeUSD
    }
  }
`;

const POOL_VOLUMES_AT_BLOCK_QUERY = gql`
  query getCurrentPairVolumes($first: Int, $block: Int) {
    pairs(first: $first, skip: 0, orderBy: reserveETH, orderDirection: desc, block: { number: $block }) {
      id
      volumeUSD
      untrackedVolumeUSD
    }
  }
`;

const appId = SUSHISWAP_DEFINITION.id;
const groupId = SUSHISWAP_DEFINITION.groups.pool.id;
const network = Network.POLYGON_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network, options: { includeInTvl: true } })
export class PolygonSushiswapPoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(UniswapV2ContractFactory)
    private readonly uniswapV2ContractFactory: UniswapV2ContractFactory,
    @Inject(UniswapV2PoolTokenHelper)
    private readonly uniswapV2PoolTokenHelper: UniswapV2PoolTokenHelper,
    @Inject(UniswapV2TheGraphPoolTokenAddressStrategy)
    private readonly uniswapV2TheGraphPoolTokenAddressStrategy: UniswapV2TheGraphPoolTokenAddressStrategy,
    @Inject(UniswapV2TheGraphPoolVolumeStrategy)
    private readonly uniswapV2TheGraphPoolVolumeStrategy: UniswapV2TheGraphPoolVolumeStrategy,
  ) {}

  getPositions() {
    return this.uniswapV2PoolTokenHelper.getTokens<UniswapFactory, UniswapPair>({
      network,
      appId,
      groupId,
      factoryAddress: '0xc0aee478e3658e2610c5f7a4a2e1777ce9e4f2ac',
      resolveFactoryContract: ({ address, network }) =>
        this.uniswapV2ContractFactory.uniswapFactory({ address, network }),
      resolvePoolContract: ({ address, network }) => this.uniswapV2ContractFactory.uniswapPair({ network, address }),
      resolvePoolTokenAddresses: this.uniswapV2TheGraphPoolTokenAddressStrategy.build({
        subgraphUrl: 'https://api.thegraph.com/subgraphs/name/chrisjess/sushiswap-matic-exchange',
        first: 500,
        poolsQuery: POOL_ADDRESSES_QUERY,
      }),
      resolvePoolTokenSymbol: ({ multicall, poolContract }) => multicall.wrap(poolContract).symbol(),
      resolvePoolTokenSupply: ({ multicall, poolContract }) => multicall.wrap(poolContract).totalSupply(),
      resolvePoolReserves: async ({ multicall, poolContract }) =>
        multicall
          .wrap(poolContract)
          .getReserves()
          .then(v => [v[0], v[1]]),
      resolvePoolUnderlyingTokenAddresses: async ({ multicall, poolContract }) =>
        Promise.all([multicall.wrap(poolContract).token0(), multicall.wrap(poolContract).token1()]),
      resolveTokenDisplaySymbol: token => (token.symbol === 'WETH' ? 'ETH' : token.symbol),
      resolvePoolVolumes: this.uniswapV2TheGraphPoolVolumeStrategy.build({
        subgraphUrl: 'https://api.thegraph.com/subgraphs/name/sushiswap/matic-exchange',
        first: 500,
        poolVolumesQuery: POOL_VOLUMES_QUERY,
        poolVolumesByIdAtBlockQuery: POOL_VOLUMES_AT_BLOCK_QUERY,
      }),
    });
  }
}
