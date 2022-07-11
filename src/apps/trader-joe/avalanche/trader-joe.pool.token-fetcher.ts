import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { OLYMPUS_DEFINITION } from '~apps/olympus/olympus.definition';
import { UniswapV2ContractFactory } from '~apps/uniswap-v2/contracts';
import { UniswapV2PoolTokenHelper } from '~apps/uniswap-v2/helpers/uniswap-v2.pool.token-helper';
import { UniswapV2TheGraphPoolTokenAddressStrategy } from '~apps/uniswap-v2/helpers/uniswap-v2.the-graph.pool-token-address-strategy';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { TRADER_JOE_DEFINITION } from '../trader-joe.definition';

const appId = TRADER_JOE_DEFINITION.id;
const groupId = TRADER_JOE_DEFINITION.groups.pool.id;
const network = Network.AVALANCHE_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class AvalancheTraderJoePoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(UniswapV2ContractFactory)
    private readonly uniswapV2ContractFactory: UniswapV2ContractFactory,
    @Inject(UniswapV2PoolTokenHelper)
    private readonly uniswapV2PoolTokenHelper: UniswapV2PoolTokenHelper,
    @Inject(UniswapV2TheGraphPoolTokenAddressStrategy)
    private readonly uniswapV2TheGraphPoolTokenAddressStrategy: UniswapV2TheGraphPoolTokenAddressStrategy,
  ) {}

  async getPositions() {
    return await this.uniswapV2PoolTokenHelper.getTokens({
      network,
      appId,
      groupId,
      factoryAddress: '0x9ad6c38be94206ca50bb0d90783181662f0cfa10',
      appTokenDependencies: [
        { appId: OLYMPUS_DEFINITION.id, groupIds: [OLYMPUS_DEFINITION.groups.gOhm.id], network },
        // @TODO: migrate me
        { appId: 'benqi', groupIds: ['s-avax'], network },
      ],
      resolveFactoryContract: ({ address, network }) =>
        this.uniswapV2ContractFactory.uniswapFactory({ address, network }),
      resolvePoolContract: ({ address, network }) => this.uniswapV2ContractFactory.uniswapPair({ address, network }),
      resolvePoolTokenAddresses: this.uniswapV2TheGraphPoolTokenAddressStrategy.build({
        subgraphUrl: 'https://api.thegraph.com/subgraphs/name/traderjoe-xyz/exchange',
        requiredPools: ['0x23ddca8de11eccd8000263f008a92e10dc1f21e8', '0x2a8a315e82f85d1f0658c5d66a452bbdd9356783'],
        first: 500,
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
