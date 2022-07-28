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
        coinAddresses: [pool.token0_address.toLowerCase(), pool.token1_address.toLowerCase()],
      })),
      resolvePoolContract: ({ network, definition }) =>
        this.contractFactory.velodromePool({ network, address: definition.swapAddress }),
      resolvePoolReserves: async ({ multicall, poolContract }) =>
        Promise.all([multicall.wrap(poolContract).reserve0(), multicall.wrap(poolContract).reserve1()]),
      resolvePoolFee: async () => BigNumber.from(0), // TODO: get actual value
      resolvePoolTokenSymbol: ({ multicall, poolTokenContract }) => multicall.wrap(poolTokenContract).symbol(),
      resolvePoolTokenSupply: ({ multicall, poolTokenContract }) => multicall.wrap(poolTokenContract).totalSupply(),
      resolvePoolTokenPrice: async ({ tokens, reserves, supply }) => {
        const [token0, token1] = tokens;
        const [reserve0, reserve1] = reserves;
        const price = (token0.price * reserve0 + token1.price * reserve1) / supply;
        return price;
      },
    });
    return tokens;
  }
}
