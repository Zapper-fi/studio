import { Inject } from '@nestjs/common';
import { UniswapV2OnChainPoolTokenAddressStrategy, UniswapV2PoolTokenHelper } from '@zapper-fi/studio/apps/uniswap-v2';
import { Network } from '@zapper-fi/types/networks';

import { RegisterPositionFetcher } from '~position/position-fetcher.decorator';
import { AppToken, ContractType, PositionFetcher } from '~position/position-fetcher.interface';

import { KyberDmmContractFactory, KyberDmmFactory, KyberDmmPool } from '../contracts';
import { KYBER_DMM_DEFINITION } from '../kyber-dmm.definition';

const appId = KYBER_DMM_DEFINITION.id;
const groupId = KYBER_DMM_DEFINITION.groups.pool.id;
const network = Network.POLYGON_MAINNET;

@RegisterPositionFetcher({ appId, groupId, network, type: ContractType.APP_TOKEN })
export class PolygonKyberDmmPoolTokenFetcher implements PositionFetcher<AppToken> {
  constructor(
    @Inject(UniswapV2PoolTokenHelper)
    private readonly poolTokenMarketDataHelper: UniswapV2PoolTokenHelper,
    @Inject(UniswapV2OnChainPoolTokenAddressStrategy)
    private readonly pairAddressStrategyFactory: UniswapV2OnChainPoolTokenAddressStrategy,
    @Inject(KyberDmmContractFactory)
    private readonly contractFactory: KyberDmmContractFactory,
  ) {}

  getPositions() {
    return this.poolTokenMarketDataHelper.getTokens<KyberDmmFactory, KyberDmmPool>({
      network,
      appId,
      groupId,
      minLiquidity: 0,
      fee: 0,
      factoryAddress: '0x5f1fe642060b5b9658c15721ea22e982643c095c',
      resolveFactoryContract: opts => this.contractFactory.kyberDmmFactory(opts),
      resolvePoolContract: opts => this.contractFactory.kyberDmmPool(opts),
      resolvePoolTokenAddresses: this.pairAddressStrategyFactory.build<KyberDmmFactory, KyberDmmPool>({
        resolvePoolsLength: ({ multicall, factoryContract }) => multicall.wrap(factoryContract).allPoolsLength(),
        resolvePoolAddress: ({ multicall, factoryContract, poolIndex }) =>
          multicall.wrap(factoryContract).allPools(poolIndex),
      }),
      resolvePoolTokenSymbol: ({ multicall, poolContract }) => multicall.wrap(poolContract).symbol(),
      resolvePoolTokenSupply: ({ multicall, poolContract }) => multicall.wrap(poolContract).totalSupply(),
      resolvePoolReserves: ({ multicall, poolContract }) =>
        multicall
          .wrap(poolContract)
          .getReserves()
          .then(v => [v[0], v[1]]),
      resolvePoolUnderlyingTokenAddresses: ({ multicall, poolContract }) =>
        Promise.all([multicall.wrap(poolContract).token0(), multicall.wrap(poolContract).token1()]),
    });
  }
}
