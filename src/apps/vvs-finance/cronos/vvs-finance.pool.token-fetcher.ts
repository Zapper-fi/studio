import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { UniswapPair, UniswapV2PoolTokenHelper } from '~apps/uniswap-v2';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { VvsFinanceContractFactory, VvsFactory } from '../contracts';
import { VVS_FINANCE_DEFINITION } from '../vvs-finance.definition';

import { CronosVvsFinancePoolAddressCacheManager } from './vvs-finance.pool.cache-manager';

const appId = VVS_FINANCE_DEFINITION.id;
const groupId = VVS_FINANCE_DEFINITION.groups.pool.id;
const network = Network.CRONOS_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network, options: { includeInTvl: true } })
export class CronosVvsFinancePoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(UniswapV2PoolTokenHelper)
    private readonly poolTokenHelper: UniswapV2PoolTokenHelper,
    @Inject(CronosVvsFinancePoolAddressCacheManager)
    private readonly vvsFinancePoolAddressCacheManager: CronosVvsFinancePoolAddressCacheManager,
    @Inject(VvsFinanceContractFactory) private readonly contractFactory: VvsFinanceContractFactory,
  ) {}

  async getPositions() {
    return await this.poolTokenHelper.getTokens<VvsFactory, UniswapPair>({
      network,
      appId,
      groupId,
      minLiquidity: 10000,
      fee: 0.003,
      factoryAddress: '0x3b44b2a187a7b3824131f8db5a74194d0a42fc15',
      resolveFactoryContract: opts => this.contractFactory.vvsFactory(opts),
      resolvePoolContract: opts => this.contractFactory.vvsPair(opts),
      resolvePoolTokenAddresses: () => this.vvsFinancePoolAddressCacheManager.getPoolAddresses(),
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
