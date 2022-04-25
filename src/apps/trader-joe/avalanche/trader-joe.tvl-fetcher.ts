import { Inject } from '@nestjs/common';
import { gql, request } from 'graphql-request';
import { sumBy } from 'lodash';

import { Register } from '~app-toolkit/decorators';
import { TvlFetcher } from '~stats/tvl/tvl-fetcher.interface';
import { Network } from '~types/network.interface';

import { TRADER_JOE_DEFINITION } from '../trader-joe.definition';

import { AvalancheTraderJoeXJoeTokenFetcher } from './trader-joe.x-joe.token-fetcher';

@Register.TvlFetcher({ appId: TRADER_JOE_DEFINITION.id, network: Network.AVALANCHE_MAINNET })
export class AvalancheTraderJoeTvlFetcher implements TvlFetcher {
  constructor(
    @Inject(AvalancheTraderJoeXJoeTokenFetcher)
    private readonly avalancheTraderJoeXJoeTokenFetcher: AvalancheTraderJoeXJoeTokenFetcher,
  ) {}

  async getTvl() {
    const graphPromise = request<{ factories: { liquidityUSD: string }[] }>(
      `https://api.thegraph.com/subgraphs/name/traderjoe-xyz/exchange`,
      gql`
        query getTraderJoeTvl {
          factories {
            liquidityUSD
          }
        }
      `,
      {},
    );

    const xJoePromise = this.avalancheTraderJoeXJoeTokenFetcher.getPositions();

    const [resp, xJoePositions] = await Promise.all([graphPromise, xJoePromise]);

    const poolTVL = parseFloat(resp.factories[0].liquidityUSD);
    const xJoeTvl = sumBy(xJoePositions, p => p.dataProps.liquidity);

    return poolTVL + xJoeTvl;
  }
}
