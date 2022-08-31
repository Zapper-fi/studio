import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import {
  UniswapV2ContractFactory,
  UniswapV2OnChainPoolTokenAddressStrategy,
  UniswapV2PoolTokenHelper,
} from '~apps/uniswap-v2';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { MESHSWAP_DEFINITION } from '../meshswap.definition';

const appId = MESHSWAP_DEFINITION.id;
const groupId = MESHSWAP_DEFINITION.groups.pool.id;
const network = Network.POLYGON_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class PolygonMeshswapPoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(UniswapV2ContractFactory) private readonly uniswapV2ContractFactory: UniswapV2ContractFactory,
    @Inject(UniswapV2PoolTokenHelper) private readonly uniswapV2PoolTokenHelper: UniswapV2PoolTokenHelper,
    @Inject(UniswapV2OnChainPoolTokenAddressStrategy)
    private readonly uniswapV2OnChainPoolTokenAddressStrategy: UniswapV2OnChainPoolTokenAddressStrategy,
  ) {}

  async getPositions() {
    return this.uniswapV2PoolTokenHelper.getTokens({
      appId,
      groupId,
      network,
      factoryAddress: '0x9f3044f7f9fc8bc9ed615d54845b4577b833282d',
      resolveFactoryContract: ({ address, network }) =>
        this.uniswapV2ContractFactory.uniswapFactory({ address, network }),
      resolvePoolContract: ({ address, network }) => this.uniswapV2ContractFactory.uniswapPair({ address, network }),
      resolvePoolTokenAddresses: this.uniswapV2OnChainPoolTokenAddressStrategy.build({
        resolvePoolsLength: ({ multicall, factoryContract }) => multicall.wrap(factoryContract).allPairsLength(),
        resolvePoolAddress: ({ multicall, factoryContract, poolIndex }) =>
          multicall.wrap(factoryContract).allPairs(poolIndex),
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
    });
  }
}
