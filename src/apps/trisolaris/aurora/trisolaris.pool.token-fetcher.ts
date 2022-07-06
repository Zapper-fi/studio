import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { UniswapV2PoolTokenHelper } from '~apps/uniswap-v2';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { TrisolarisContractFactory } from '../contracts';
import { TrisolarisFactory } from '../contracts/ethers/TrisolarisFactory';
import { TrisolarisPair } from '../contracts/ethers/TrisolarisPair';
import TRISOLARIS_DEFINITION from '../trisolaris.definition';

import { AuroraTrisolarisPoolAddressCacheManager } from './trisolaris.pool.cache-manager';

const appId = TRISOLARIS_DEFINITION.id;
const groupId = TRISOLARIS_DEFINITION.groups.pool.id;
const network = Network.AURORA_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network, options: { includeInTvl: true } })
export class AuroraTrisolarisPoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(UniswapV2PoolTokenHelper)
    private readonly poolTokenHelper: UniswapV2PoolTokenHelper,
    @Inject(AuroraTrisolarisPoolAddressCacheManager)
    private readonly addressCacheManager: AuroraTrisolarisPoolAddressCacheManager,
    @Inject(TrisolarisContractFactory) private readonly contractFactory: TrisolarisContractFactory,
  ) {}

  getPositions() {
    return this.poolTokenHelper.getTokens<TrisolarisFactory, TrisolarisPair>({
      network,
      appId,
      groupId,
      fee: 0.003,
      factoryAddress: '0xc66f594268041db60507f00703b152492fb176e7',
      resolveFactoryContract: opts => this.contractFactory.trisolarisFactory(opts),
      resolvePoolContract: opts => this.contractFactory.trisolarisPair(opts),
      resolvePoolTokenAddresses: () => this.addressCacheManager.getPoolAddresses(),
      resolvePoolTokenSymbol: ({ multicall, poolContract }) => multicall.wrap(poolContract).symbol(),
      resolvePoolTokenSupply: ({ multicall, poolContract }) => multicall.wrap(poolContract).totalSupply(),
      resolvePoolReserves: async ({ multicall, poolContract }) => {
        const reserves = await multicall.wrap(poolContract).getReserves();
        return [reserves[0], reserves[1]];
      },
      resolvePoolUnderlyingTokenAddresses: async ({ multicall, poolContract }) => {
        return Promise.all([multicall.wrap(poolContract).token0(), multicall.wrap(poolContract).token1()]);
      },
    });
  }
}
