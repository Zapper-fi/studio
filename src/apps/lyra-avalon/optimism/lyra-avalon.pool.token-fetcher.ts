import { Inject } from '@nestjs/common';
import Axios from 'axios';
import { gql } from 'graphql-request';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { CacheOnInterval } from '~cache/cache-on-interval.decorator';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { LyraAvalonContractFactory, LiquidityToken } from '../contracts';
import { LYRA_AVALON_DEFINITION } from '../lyra-avalon.definition';

import { runQuery } from './helpers/graph';

const appId = LYRA_AVALON_DEFINITION.id;
const groupId = LYRA_AVALON_DEFINITION.groups.pool.id;
const network = Network.OPTIMISM_MAINNET;

type LyraMainnetAddresses = Record<
  string,
  {
    contractName: string;
    source: string;
    address: string;
    txn: string;
    blockNumber: number;
  }
>;

// TODO: find better way to determine available markets
type QueryResponse = {
  markets: {
    id: string;
    baseAddress: string;
    quoteAddress: string;
    liquidityPool: {
      id: string;
    };
  }[];
};
const QUERY = gql`
  {
    markets(where: { isRemoved: false }) {
      id
      baseAddress
      quoteAddress
      liquidityPool {
        id
      }
    }
  }
`;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class OptimismLyraAvalonPoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(LyraAvalonContractFactory) private readonly contractFactory: LyraAvalonContractFactory,
  ) {}

  @CacheOnInterval({
    key: `studio:${appId}:${groupId}:${network}:addresses`,
    timeout: 15 * 60 * 1000,
  })
  private async getCachedAddressConfig() {
    const { data } = await Axios.get<LyraMainnetAddresses>(
      'https://raw.githubusercontent.com/lyra-finance/subgraph/master/addresses/mainnet-ovm/lyra.json',
    );

    return data;
  }

  async getPositions() {
    const addresses = await this.getCachedAddressConfig();
    const multicall = this.appToolkit.getMulticall(network);
    const registryContract = this.contractFactory.lyraRegistry({ address: addresses.LyraRegistry.address, network });

    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const quoteToken = baseTokens.find(token => token.symbol === 'sUSD')!;

    const response = await runQuery<QueryResponse>(this.appToolkit.helpers.theGraphHelper, QUERY);
    const markets = await Promise.all(
      response.markets.map(market => multicall.wrap(registryContract).marketAddresses(market.id)),
    );

    const tokens = await this.appToolkit.helpers.vaultTokenHelper.getTokens<LiquidityToken>({
      appId,
      groupId,
      network,
      resolveVaultAddresses: () => markets.map(market => market.liquidityTokens),
      resolveContract: ({ address, network }) => this.contractFactory.liquidityToken({ address, network }),
      // Note: There are actually two underlying tokens
      // We will pretend there is only USD and use the price specified by the pool contract
      resolveUnderlyingTokenAddress: () => quoteToken.address,
      resolveReserve: () => 0,
      resolvePricePerShare: async ({ multicall, contract, underlyingToken }) => {
        const pool = await multicall.wrap(contract).liquidityPool();
        const poolContract = this.contractFactory.liquidityPool({ address: pool, network });
        const ratio = await multicall.wrap(poolContract).getTokenPrice();
        return Number(ratio) / 10 ** underlyingToken.decimals;
      },
    });
    return tokens;
  }
}
