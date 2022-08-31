import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { UniswapV2TheGraphPoolTokenAddressStrategy } from '~apps/uniswap-v2';
import { UniswapV2PoolTokenHelper } from '~apps/uniswap-v2/helpers/uniswap-v2.pool.token-helper';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { HoneyswapContractFactory, HoneyswapFactory, HoneyswapPair } from '../contracts';
import { HONEYSWAP_DEFINITION } from '../honeyswap.definition';

const appId = HONEYSWAP_DEFINITION.id;
const groupId = HONEYSWAP_DEFINITION.groups.pool.id;
const network = Network.GNOSIS_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class GnosisHoneyswapPoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(HoneyswapContractFactory) private readonly honeyswapContractFactory: HoneyswapContractFactory,
    @Inject(UniswapV2PoolTokenHelper)
    private readonly uniswapV2PoolTokenHelper: UniswapV2PoolTokenHelper,
    @Inject(UniswapV2TheGraphPoolTokenAddressStrategy)
    private readonly uniswapV2TheGraphPoolTokenAddressStrategy: UniswapV2TheGraphPoolTokenAddressStrategy,
  ) {}

  async getPositions() {
    return this.uniswapV2PoolTokenHelper.getTokens<HoneyswapFactory, HoneyswapPair>({
      network,
      appId,
      groupId,
      factoryAddress: '0x9ad6c38be94206ca50bb0d90783181662f0cfa10',
      resolveFactoryContract: ({ address, network }) =>
        this.honeyswapContractFactory.honeyswapFactory({
          address,
          network,
        }),
      resolvePoolContract: ({ address, network }) => this.honeyswapContractFactory.honeyswapPair({ address, network }),
      resolvePoolTokenAddresses: this.uniswapV2TheGraphPoolTokenAddressStrategy.build({
        subgraphUrl: 'https://api.thegraph.com/subgraphs/name/1hive/honeyswap-xdai',
        first: 500,
      }),
      resolvePoolTokenSymbol: ({ multicall, poolContract }) => multicall.wrap(poolContract).symbol(),
      resolvePoolTokenSupply: ({ multicall, poolContract }) => multicall.wrap(poolContract).totalSupply(),
      resolvePoolReserves: async ({ multicall, poolContract }) => {
        const reserves = await multicall.wrap(poolContract).getReserves();
        return [reserves[0], reserves[1]];
      },
      resolvePoolUnderlyingTokenAddresses: async ({ multicall, poolContract }) =>
        Promise.all([multicall.wrap(poolContract).token0(), multicall.wrap(poolContract).token1()]),
    });
  }
}
