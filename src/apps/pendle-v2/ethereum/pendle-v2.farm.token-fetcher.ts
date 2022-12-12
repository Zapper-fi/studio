import { Inject } from '@nestjs/common';
import request, { gql } from 'graphql-request';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { BaseToken } from '~position/token.interface';
import { Network, NETWORK_IDS } from '~types/network.interface';

import { PendleV2ContractFactory } from '../contracts';
import { BACKEND_QUERIES, PENDLE_V2_GRAPHQL_ENDPOINT } from '../pendle-v2.constant';
import { PENDLE_V_2_DEFINITION } from '../pendle-v2.definition';
import { MarketResponse, MarketsQueryResponse } from '../pendle-v2.types';

const appId = PENDLE_V_2_DEFINITION.id;
const groupId = PENDLE_V_2_DEFINITION.groups.farm.id;
const network = Network.ETHEREUM_MAINNET;

export type PendleMarketDataProps = {
  aggregatedApy: number;
  reserves: {
    totalPt: number;
    totalSy: number;
  }
};


@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumPendleV2FarmTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(PendleV2ContractFactory) private readonly pendleV2ContractFactory: PendleV2ContractFactory,
  ) { }

  async getPositions() {
    let resp: MarketsQueryResponse = await request(PENDLE_V2_GRAPHQL_ENDPOINT, BACKEND_QUERIES.getMarkets, {
      chainId: NETWORK_IDS[network],
    });

    const markets: MarketResponse[] = resp.markets.results;
    const multicall = this.appToolkit.getMulticall(network);
    const tokens = await Promise.all(
      markets.map(async (market) => {
        // Instantiate a smart contract instance pointing to the jar token address
        const contract = this.pendleV2ContractFactory.pendleMarket({
          address: market.address,
          network,
        });
        const decimals = 18;
        const supplyRaw = await multicall.wrap(contract).totalSupply();
        const supply = Number(supplyRaw) / 10 ** decimals

        const price = market.lp.price.usd;
        const pricePerShare = [price / market.pt.price.usd, price / market.sy.price.usd];

        const formattedApy = (market.aggregatedApy * 100).toFixed(2);
        const secondaryLabel = `${formattedApy}% APY`;

        const token: AppTokenPosition<PendleMarketDataProps> = {
          type: ContractType.APP_TOKEN,
          appId,
          groupId,
          address: market.address,
          network,
          symbol: market.symbol,
          decimals,
          supply,
          price,
          pricePerShare,
          dataProps: {
            aggregatedApy: market.aggregatedApy,
            reserves: market.reserves,
          },
          displayProps: {
            label: market.proName,
            images: [market.proIcon],
            secondaryLabel,
          },
          // TODO: add pt and sy as tokens
          tokens: [],
        };

        return token;
      })
    );

    return tokens;
  }
}
