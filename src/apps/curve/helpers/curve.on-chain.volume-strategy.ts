import { Injectable } from '@nestjs/common';
import { gql } from 'graphql-request';
import { request } from 'graphql-request';
import { sumBy } from 'lodash';
import moment from 'moment';

import { Cache } from '~cache/cache.decorator';
import { AppTokenPosition, Token } from '~position/position.interface';

import { CurveFactoryPool } from '../contracts';

type GetBlockResponse = {
  blocks: {
    id: string;
    number: string;
    timestamp: string;
  }[];
};

@Injectable()
export class CurveOnChainVolumeStrategy {
  @Cache({
    key: daysAgo => `curve:block-from-days-ago:${daysAgo}`,
    ttl: 60,
  })
  async getBlockFromDaysAgo(daysAgo: number): Promise<number> {
    const {
      blocks: [{ number: block }],
    } = await request<GetBlockResponse>(
      'https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks',
      gql`
        query getBlock($timestamp: Int) {
          blocks(first: 1, orderBy: timestamp, orderDirection: asc, where: { timestamp_gt: $timestamp }) {
            id
            number
            timestamp
          }
        }
      `,
      { timestamp: moment.utc().subtract(daysAgo, 'day').unix() },
      { Accept: 'api_version=2' },
    );

    return Number(block);
  }

  build({ includeUnderlying }: { includeUnderlying: boolean }) {
    return async ({ poolContract, tokens }: { poolContract: CurveFactoryPool; tokens: Token[] }) => {
      const fromBlock = await this.getBlockFromDaysAgo(1);

      const tokenExchangeFilter = poolContract.filters.TokenExchange(null, null, null, null, null);

      const tokenExchangeEvents = await poolContract.queryFilter(tokenExchangeFilter, fromBlock, 'latest');

      let volume = sumBy(tokenExchangeEvents, event => {
        const toTokenIndex = Number(event.args.bought_id);
        const toTokenMatch = tokens[toTokenIndex];
        if (!toTokenMatch) return 0;

        const toTokenAmountRaw = event.args.tokens_bought;
        const volumeOfEvent = (Number(toTokenAmountRaw) / 10 ** toTokenMatch.decimals) * toTokenMatch.price;
        return volumeOfEvent;
      });

      if (includeUnderlying) {
        const tokenExchangeUnderlyingFilter = poolContract.filters.TokenExchangeUnderlying(
          null,
          null,
          null,
          null,
          null,
        );

        const tokenExchangeUnderlyingEvents = await poolContract.queryFilter(
          tokenExchangeUnderlyingFilter,
          fromBlock,
          'latest',
        );

        volume += sumBy(tokenExchangeUnderlyingEvents, event => {
          const toTokenIndex = Number(event.args.bought_id);
          const toTokenMatch =
            toTokenIndex === 0 ? tokens[0] : (tokens[1] as AppTokenPosition).tokens[toTokenIndex - 1];
          if (!toTokenMatch) return 0;

          const toTokenAmountRaw = event.args.tokens_bought;
          const volumeOfEvent = (Number(toTokenAmountRaw) / 10 ** toTokenMatch.decimals) * toTokenMatch.price;
          return volumeOfEvent;
        });
      }

      return volume;
    };
  }
}
