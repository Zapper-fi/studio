import { Inject, Injectable } from '@nestjs/common';
import { gql } from 'graphql-request';
import { compact } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Cache } from '~cache/cache.decorator';
import { Network } from '~types/network.interface';

import AURA_DEFINITION from '../aura.definition';
import { AuraContractFactory } from '../contracts';

type GetRewardsDataPropsParams = {
  network: Network;
  rewardPoolAddresses: string[];
};

export type AuraSingleStakingFarmDefinition = {
  address: string;
  reserveAddress?: string;
  stakedTokenAddress: string;
  rewardTokenAddresses: string[];
  extraRewardTokenAddresses: {
    address: string;
    rewardToken: string;
  }[];
};

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

const network = Network.ETHEREUM_MAINNET;

@Injectable()
export class AuraRewardPoolResolver {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(AuraContractFactory)
    protected readonly contractFactory: AuraContractFactory,
  ) {}

  @Cache({
    key: `studio:${AURA_DEFINITION.id}:reward-pool:data`,
    ttl: 15 * 60,
  })
  private async getRewardPoolDefinitionData(): Promise<string[]> {
    const endpoint = `https://api.thegraph.com/subgraphs/name/aurafinance/aura`;
    const { pools } = await this.appToolkit.helpers.theGraphHelper.request<RewardPools>({
      endpoint,
      query: REWARD_POOLS_QUERY,
    });

    return compact(pools.map(pool => pool.rewardPool));
  }

  async getRewardPoolDefinitions() {
    const rewardPoolAddresses = await this.getRewardPoolDefinitionData();
    return this.getPoolDefinitions(rewardPoolAddresses);
  }

  async getStakingDefinition() {
    const STAKING_POOL_ADDRESS = '0x5e5ea2048475854a5702f5b8468a51ba1296efcc';
    return this.getPoolDefinitions([STAKING_POOL_ADDRESS]);
  }

  private async getPoolDefinitions(poolAddresses: string[]): Promise<AuraSingleStakingFarmDefinition[]> {
    const multicall = this.appToolkit.getMulticall(network);
    const rewardsDataProps = await this.getRewardsDataProps({ rewardPoolAddresses: poolAddresses, network });

    const rewardPoolDefinitions = await Promise.all(
      poolAddresses.map(async address => {
        const contract = this.contractFactory.auraBaseRewardPool({ address, network });
        const stakedTokenAddressRaw = await multicall.wrap(contract).stakingToken();
        const stakedTokenAddress = stakedTokenAddressRaw.toLowerCase();

        const rewards = rewardsDataProps.find(r => r.rewardPool === contract.address)!;
        const { rewardToken, extraRewards } = rewards;

        return {
          address,
          stakedTokenAddress,
          rewardTokenAddresses: [rewardToken],
          extraRewardTokenAddresses: extraRewards,
        };
      }),
    );

    return rewardPoolDefinitions;
  }

  async getRewardsDataProps({
    rewardPoolAddresses,
    network,
  }: GetRewardsDataPropsParams): Promise<
    { rewardPool: string; rewardToken: string; extraRewards: { address: string; rewardToken: string }[] }[]
  > {
    const multicall = this.appToolkit.getMulticall(network);

    return Promise.all(
      rewardPoolAddresses.map(async rewardPool => {
        const contract = this.contractFactory.auraBaseRewardPool({ address: rewardPool, network });

        const extraRewardsLength = Number(await contract.extraRewardsLength());

        let extraRewards: { address: string; rewardToken: string }[] = [];

        if (extraRewardsLength > 0) {
          const indexes = [...Array(extraRewardsLength).keys()];
          const extraRewardsAddresses = await Promise.all(
            indexes.map(index => multicall.wrap(contract).extraRewards(index)),
          );
          const extraRewardTokens = await Promise.all(
            extraRewardsAddresses
              .map(address => this.contractFactory.auraVirtualBalanceRewardPool({ address, network }))
              .map(contract => multicall.wrap(contract).rewardToken()),
          );
          extraRewards = extraRewardsAddresses.map((address, index) => ({
            address: address.toLowerCase(),
            rewardToken: extraRewardTokens[index].toLowerCase(),
          }));
        }

        const rewardToken = (await multicall.wrap(contract).rewardToken()).toLowerCase();

        return { rewardPool, rewardToken, extraRewards };
      }),
    );
  }
}
