import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';
import { sum } from 'lodash';

import { Register } from '~app-toolkit/decorators';
import { APP_TOOLKIT, IAppToolkit } from '~lib';
import { TvlFetcher } from '~stats/tvl/tvl-fetcher.interface';
import { Network } from '~types/network.interface';
import { PoolTogetherContractFactory } from '../contracts';
import { PoolTogetherApiPrizePoolRegistry } from '../helpers/pool-together.api.prize-pool-registry';

import { POOL_TOGETHER_DEFINITION } from '../pool-together.definition';

const appId = POOL_TOGETHER_DEFINITION.id;
const network = Network.POLYGON_MAINNET;

@Register.TvlFetcher({ appId, network })
export class PolygonPoolTogetherTvlFetcher implements TvlFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(PoolTogetherApiPrizePoolRegistry) private readonly prizePoolRegistry: PoolTogetherApiPrizePoolRegistry,
    @Inject(PoolTogetherContractFactory) private readonly poolTogetherContractFactory: PoolTogetherContractFactory,
  ) {}

  async getTvl() {
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const [v4PrizePoolAddresses, v3PrizePoolAddresses] = await Promise.all([
      this.prizePoolRegistry.getV4PrizePools(network),
      this.prizePoolRegistry.getV3PrizePools(network),
    ]);
    const allPrizePoolAddresses = [...v4PrizePoolAddresses, ...v3PrizePoolAddresses];

    const multicall = this.appToolkit.getMulticall(network);

    const toSum = await Promise.all(
      allPrizePoolAddresses.map(async prizePool => {
        const baseToken = baseTokens.find(baseToken => baseToken.address === prizePool.underlyingTokenAddress);
        if (!baseToken) return 0;

        const contract = this.poolTogetherContractFactory.erc20({
          address: prizePool.ticketAddress,
          network,
        });

        const [decimals, totalSupply] = await Promise.all([
          multicall.wrap(contract).decimals(),
          multicall.wrap(contract).totalSupply(),
        ]);

        return (Number(totalSupply) / 10 ** decimals) * baseToken.price;
      }),
    );

    return sum(toSum);
  }
}
