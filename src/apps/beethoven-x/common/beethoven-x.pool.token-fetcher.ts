import { gql } from 'graphql-request';

import { gqlFetch } from '~app-toolkit/helpers/the-graph.helper';
import {
  BalancerV2PoolTokenDataProps,
  BalancerV2PoolTokenDefinition,
  BalancerV2PoolTokenFetcher,
} from '~apps/balancer-v2/common/balancer-v2.pool.token-fetcher';
import { BalancerPool } from '~apps/balancer-v2/contracts';
import { GetDisplayPropsParams, GetTokenPropsParams } from '~position/template/app-token.template.types';

type GetPoolsResponse = {
  poolGetPools: {
    id: string;
    name: string;
    address: string;
    factory: string;
    type: string;
    dynamicData: {
      totalLiquidity: string;
    };
  }[];
};

const GET_POOLS_QUERY = gql`
  query {
    poolGetPools(first: 1000, orderBy: totalLiquidity, orderDirection: desc) {
      id
      name
      address
      factory
      type
      dynamicData {
        totalLiquidity
      }
    }
  }
`;

export abstract class BeethovenXPoolTokenFetcher extends BalancerV2PoolTokenFetcher {
  abstract composablePoolFactories: string[];
  abstract weightedPoolV2Factories: string[];

  async getDefinitions() {
    const poolsResponse = await gqlFetch<GetPoolsResponse>({
      endpoint: this.subgraphUrl,
      query: GET_POOLS_QUERY,
      headers: { 'Content-Type': 'application/json' },
    });

    return poolsResponse.poolGetPools
      .filter(v => Number(v.dynamicData.totalLiquidity) > 10_000)
      .map(({ address, type, factory }) => ({ address, poolType: type, factory }));
  }

  async getSupply({
    address,
    contract,
    definition,
    multicall,
  }: GetTokenPropsParams<BalancerPool, BalancerV2PoolTokenDataProps, BalancerV2PoolTokenDefinition>) {
    // Logic derived from https://github.com/beethovenxfi/beethovenx-backend/blob/v2-main/modules/pool/lib/pool-on-chain-data.service.ts#L157-L172

    if (
      (definition.poolType === 'PHANTOM_STABLE' && this.composablePoolFactories.includes(definition.factory)) ||
      (definition.poolType === 'WEIGHTED' && this.weightedPoolV2Factories.includes(definition.factory))
    ) {
      const phantomPoolContract = this.contractFactory.balancerComposableStablePool({ address, network: this.network });
      return multicall.wrap(phantomPoolContract).getActualSupply();
    } else if (definition.poolType === 'LINEAR' || definition.poolType === 'PHANTOM_STABLE') {
      const phantomPoolContract = this.contractFactory.balancerStablePhantomPool({ address, network: this.network });
      return multicall.wrap(phantomPoolContract).getVirtualSupply();
    }

    return contract.totalSupply();
  }

  async getLabel({ contract }: GetDisplayPropsParams<BalancerPool>) {
    return contract.name();
  }
}
