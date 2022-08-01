import { Inject } from '@nestjs/common';
import Axios from 'axios';
import { BigNumber } from 'ethers';

import { Register } from '~app-toolkit/decorators';
import { CurvePoolTokenHelper } from '~apps/curve';
import { CacheOnInterval } from '~cache/cache-on-interval.decorator';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { VelodromeContractFactory, VelodromePool } from '../contracts';
import { VELODROME_DEFINITION } from '../velodrome.definition';

const appId = VELODROME_DEFINITION.id;
const groupId = VELODROME_DEFINITION.groups.pool.id;
const network = Network.OPTIMISM_MAINNET;

interface PairData {
  address: string;
  gauge_address: string;
  token0_address: string;
  token1_address: string;
}

@Register.TokenPositionFetcher({ appId, groupId, network })
export class OptimismVelodromePoolsTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(CurvePoolTokenHelper)
    private readonly curvePoolTokenHelper: CurvePoolTokenHelper,
    @Inject(VelodromeContractFactory) private readonly contractFactory: VelodromeContractFactory,
  ) {}

  @CacheOnInterval({
    key: `studio:${network}:${appId}:${groupId}:definitions`,
    timeout: 15 * 60 * 1000,
  })
  async getDefinitions() {
    const { data } = await Axios.get<{ data: PairData[] }>('https://api.velodrome.finance/api/v1/pairs');
    return data;
  }

  async getPositions() {
    const { data } = await this.getDefinitions();
    const tokens = await this.curvePoolTokenHelper.getTokens<VelodromePool>({
      network,
      appId,
      groupId,
      poolDefinitions: data.map(pool => ({
        swapAddress: pool.address.toLowerCase(),
        tokenAddress: pool.address.toLowerCase(),
        gaugeAddress: pool.gauge_address.toLowerCase(),
      })),
      resolvePoolContract: ({ network, address }) => this.contractFactory.velodromePool({ network, address }),
      resolvePoolCoinAddresses: async ({ multicall, poolContract }) =>
        Promise.all([multicall.wrap(poolContract).token0(), multicall.wrap(poolContract).token1()]),
      resolvePoolReserves: async ({ multicall, poolContract }) =>
        Promise.all([multicall.wrap(poolContract).reserve0(), multicall.wrap(poolContract).reserve1()]),
      resolvePoolFee: async () => BigNumber.from(0), // TODO: get actual value
      resolvePoolTokenPrice: async ({ tokens, reserves, supply }) =>
        (tokens[0].price * reserves[0] + tokens[1].price * reserves[1]) / supply,
    });
    return tokens;
  }
}
