import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';

import { Register } from '~app-toolkit/decorators';
import { APP_TOOLKIT, IAppToolkit } from '~lib';
import { TvlFetcher } from '~stats/tvl/tvl-fetcher.interface';
import { Network } from '~types/network.interface';
import { PoolTogetherContractFactory } from '../contracts';
import { PoolTogetherApiPrizePoolRegistry } from '../helpers/pool-together.api.prize-pool-registry';

import { POOL_TOGETHER_DEFINITION } from '../pool-together.definition';

const appId = POOL_TOGETHER_DEFINITION.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TvlFetcher({ appId, network })
export class EthereumPoolTogetherTvlFetcher implements TvlFetcher {
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
    const promises: Promise<number | BigNumber>[] = [];
    allPrizePoolAddresses.forEach(prizePool => {
      const contract = this.poolTogetherContractFactory.erc20({
        address: prizePool.ticketAddress,
        network,
      });
      promises.push(multicall.wrap(contract).decimals(), multicall.wrap(contract).totalSupply());
    });

    const results = await Promise.all(promises);

    let tvl = 0;
    for (let i = 0; i < allPrizePoolAddresses.length; i++) {
      const addresses = allPrizePoolAddresses[i];
      const baseToken = baseTokens.find(baseToken => baseToken.address === addresses.underlyingTokenAddress);

      if (baseToken) {
        const decimals = results[i * 2] as number;
        const totalSupply = results[i * 2 + 1] as BigNumber;
        tvl += (Number(totalSupply) / 10 ** decimals) * baseToken.price;
      }
    }

    return tvl;
  }
}
