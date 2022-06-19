import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import JONES_DAO_DEFINITION from '~apps/jones-dao/jones-dao.definition';
import { OLYMPUS_DEFINITION } from '~apps/olympus/olympus.definition';
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

const appId = SUSHISWAP_DEFINITION.id;
const groupId = SUSHISWAP_DEFINITION.groups.pool.id;
const network = Network.ARBITRUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network, options: { includeInTvl: true } })
export class ArbitrumSushiswapPoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
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
      factoryAddress: '0xc35dadb65012ec5796536bd9864ed8773abc74c4',
      resolveFactoryContract: ({ address, network }) =>
        this.uniswapV2ContractFactory.uniswapFactory({ address, network }),
      resolvePoolContract: ({ address, network }) => this.uniswapV2ContractFactory.uniswapPair({ network, address }),
      resolvePoolTokenAddresses: this.uniswapV2TheGraphPoolTokenAddressStrategy.build({
        subgraphUrl: 'https://api.thegraph.com/subgraphs/name/sushiswap/arbitrum-exchange',
        first: 900,
      }),
      appTokenDependencies: [
        { appId: OLYMPUS_DEFINITION.id, groupIds: [OLYMPUS_DEFINITION.groups.gOhm.id], network },
        { appId: JONES_DAO_DEFINITION.id, groupIds: [JONES_DAO_DEFINITION.groups.vault.id], network },
      ],
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
        subgraphUrl: 'https://api.thegraph.com/subgraphs/name/sushiswap/arbitrum-exchange',
        first: 500,
      }),
    });
  }
}
