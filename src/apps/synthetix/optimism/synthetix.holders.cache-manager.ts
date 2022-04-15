import { Inject } from '@nestjs/common';
import { gql, GraphQLClient } from 'graphql-request';

import { CacheOnInterval } from '~cache/cache-on-interval.decorator';
import { APP_TOOLKIT, IAppToolkit } from '~lib';
import { Network } from '~types/network.interface';

import { SYNTHETIX_DEFINITION } from '../synthetix.definition';

const ENDPOINT = 'https://api.thegraph.com/subgraphs/name/synthetixio-team/optimism-main';

type Holder = {
  id: string;
  collateral: string;
  transferable: string;
  initialDebtOwnership: string;
};

type HoldersResult = {
  snxholders: Holder[];
};

const HOLDERS_QUERY = gql`
  query getHolders($lastId: String!) {
    snxholders(
      first: 1000
      skip: $skip
      orderBy: collateral
      orderDirection: desc
      where: { initialDebtOwnership_not: "0", id_gt: $lastId }
    ) {
      id
      collateral
      transferable
      initialDebtOwnership
    }
  }
`;

export class OptimismSynthetixHoldersCacheManager {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  @CacheOnInterval({
    key: `studio:${SYNTHETIX_DEFINITION.id}:${Network.OPTIMISM_MAINNET}:snx-holders`,
    timeout: 15 * 60 * 1000,
  })
  private async cacheHolders() {
    const client = new GraphQLClient(ENDPOINT);
    const holders = new Map<string, Holder>();

    let lastResult: HoldersResult;
    let lastId = '';

    do {
      lastResult = await client.request<HoldersResult>(HOLDERS_QUERY, { lastId });
      lastId = lastResult.snxholders[lastResult.snxholders.length - 1].id;
      lastResult.snxholders.forEach(v => holders.set(v.id, v));
    } while (lastResult.snxholders.length === 1000);

    return Array.from(holders.values());
  }

  async getHolders() {
    const holders = this.appToolkit.getFromCache<Holder[]>(
      `studio:${SYNTHETIX_DEFINITION.id}:${Network.OPTIMISM_MAINNET}:snx-holders`,
    );

    return holders ?? [];
  }
}
