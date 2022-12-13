import { Inject } from '@nestjs/common';
import { gql } from 'graphql-request';
import { chain } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { AuraBaseRewardPoolHelper } from '~apps/aura/helpers/aura.base-reward-pool-helper';
import { BALANCER_V2_DEFINITION } from '~apps/balancer-v2';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { AURA_DEFINITION } from '../aura.definition';
import { AuraSubgraphHelper } from '../helpers/aura.subgraph-helper';

const appId = AURA_DEFINITION.id;
const groupId = AURA_DEFINITION.groups.pool.id;
const network = Network.ETHEREUM_MAINNET;

type RewardPools = {
  pools: {
    rewardPool: string;
  }[];
};

const REWARD_POOLS_QUERY = gql`
  {
    pools(where: { isFactoryPool: true }) {
      rewardPool
    }
  }
`;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumAuraPoolContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(AuraSubgraphHelper) private readonly subgraphHelper: AuraSubgraphHelper,
    @Inject(AuraBaseRewardPoolHelper) private readonly auraBaseRewardPoolHelper: AuraBaseRewardPoolHelper,
  ) {}

  async getPositions() {
    const rewardPools = await this.getRewardPools();

    return this.auraBaseRewardPoolHelper.getBaseRewardPoolContractPositions({
      appId,
      network,
      groupId,
      dependencies: [
        { appId: BALANCER_V2_DEFINITION.id, network, groupIds: [BALANCER_V2_DEFINITION.groups.pool.id] },
        {
          appId: AURA_DEFINITION.id,
          network,
          groupIds: [AURA_DEFINITION.groups.auraBal.id, AURA_DEFINITION.groups.deposit.id],
        },
      ],
      rewardPools,
    });
  }

  private async getRewardPools() {
    const rewardPoolsAllVersions = await this.subgraphHelper.requestAllVersions<RewardPools>(REWARD_POOLS_QUERY);

    return chain(rewardPoolsAllVersions)
      .entries()
      .flatMap(([version, query]) =>
        query.pools.map(({ rewardPool }) => {
          if (!rewardPool) {
            return null;
          }
          const deprecated = version === 'v1';
          return { address: rewardPool, deprecated };
        }),
      )
      .compact()
      .uniqBy(rewardPool => rewardPool.address)
      .value();
  }
}
