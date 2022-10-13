import { gql } from 'graphql-request';

import { BalancerV2PoolTokenFetcher } from '~apps/balancer-v2/common/balancer-v2.pool.token-fetcher';
import { BalancerPool } from '~apps/balancer-v2/contracts';
import { GetDisplayPropsParams } from '~position/template/app-token.template.types';

type GetPoolsResponse = {
  pools: {
    address: string;
    poolType: string;
    totalLiquidity: string;
  }[];
};

const GET_POOLS_QUERY = gql`
  {
    pools {
      address
      poolType
      totalLiquidity
    }
  }
`;

export abstract class BeethovenXPoolTokenFetcher extends BalancerV2PoolTokenFetcher {
  async getDefinitions() {
    const poolsResponse = await this.appToolkit.helpers.theGraphHelper.request<GetPoolsResponse>({
      endpoint: this.subgraphUrl,
      query: GET_POOLS_QUERY,
      headers: { 'Content-Type': 'application/json' },
    });

    return poolsResponse.pools.map(({ address, poolType }) => ({ address, poolType }));
  }

  async getLabel({ contract }: GetDisplayPropsParams<BalancerPool>) {
    return contract.name();
  }
}
