import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import _ from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { buildDollarDisplayItem, buildNumberDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { gqlFetch } from '~app-toolkit/helpers/the-graph.helper';
import { SpoolViemContractFactory } from '~apps/spool/contracts';
import {
  REWARDS_QUERY,
  SPOOL_ADDRESS,
  SPOOL_STAKED_QUERY,
  STAKING_ADDRESS,
  SUBGRAPH_API_BASE_URL,
  VOSPOOL_ADDRESS,
} from '~apps/spool/ethereum/spool.constants';
import { StakingReward, UserSpoolStaking } from '~apps/spool/ethereum/spool.types';
import { MetaType } from '~position/position.interface';
import { isClaimable, isSupplied } from '~position/position.utils';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDataPropsParams,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
} from '~position/template/contract-position.template.types';

import { SpoolStaking } from '../contracts/viem';

type SpoolStakingDataProps = {
  tvl: number;
  spoolStaked: number;
  totalAccVoSpool: number;
};

@PositionTemplate()
export class EthereumSpoolStakingContractPositionFetcher extends ContractPositionTemplatePositionFetcher<
  SpoolStaking,
  SpoolStakingDataProps
> {
  groupLabel = 'Staking';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(SpoolViemContractFactory) protected readonly contractFactory: SpoolViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.spoolStaking({ address, network: this.network });
  }

  async getDefinitions() {
    return [{ address: STAKING_ADDRESS }];
  }

  async getTokenDefinitions() {
    const now = parseInt(String(new Date().getTime() / 1000));
    const stakingRewards = await gqlFetch<StakingReward>({
      endpoint: SUBGRAPH_API_BASE_URL,
      query: REWARDS_QUERY,
    });

    // SpoolStaking can emit arbitrary tokens; VoSpoolRewards always emits SPOOL
    const rewardAddresses = _.uniq(
      stakingRewards.stakingRewardTokens
        .filter(reward => !reward.isRemoved && parseInt(reward.startTime) >= now && parseInt(reward.endTime) <= now)
        .map(reward => reward.token.id)
        .concat([SPOOL_ADDRESS]),
    );

    return [
      { metaType: MetaType.SUPPLIED, address: SPOOL_ADDRESS, network: this.network },
      { metaType: MetaType.VESTING, address: VOSPOOL_ADDRESS, network: this.network },
      ...rewardAddresses.map(address => ({ metaType: MetaType.CLAIMABLE, address, network: this.network })),
    ];
  }

  async getDataProps({ multicall, contractPosition }: GetDataPropsParams<SpoolStaking, SpoolStakingDataProps>) {
    const [spoolToken, voSpoolToken] = contractPosition.tokens;
    const spoolContract = this.appToolkit.globalViemContracts.erc20(spoolToken);
    const voSpoolContract = this.contractFactory.spoolVospool(voSpoolToken);

    const totalStakedRaw = await multicall.wrap(spoolContract).read.balanceOf([STAKING_ADDRESS]);
    const votingPowerRaw = await multicall.wrap(voSpoolContract).read.getTotalGradualVotingPower();

    const totalAccVoSpool = Number(votingPowerRaw) / 10 ** voSpoolToken.decimals;
    const spoolStaked = Number(totalStakedRaw) / 10 ** spoolToken.decimals;
    const tvl = spoolStaked * spoolToken.price;

    return { tvl, spoolStaked, totalAccVoSpool };
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<SpoolStaking>) {
    return `${getLabelFromToken(contractPosition.tokens[0])} Staking`;
  }

  async getStatsItems({ contractPosition }: GetDisplayPropsParams<SpoolStaking, SpoolStakingDataProps>) {
    return [
      { label: 'TVL', value: buildDollarDisplayItem(contractPosition.dataProps.tvl) },
      { label: 'SPOOL Staked', value: buildNumberDisplayItem(contractPosition.dataProps.spoolStaked) },
      { label: 'voSPOOL Accumulated', value: buildNumberDisplayItem(contractPosition.dataProps.totalAccVoSpool) },
    ];
  }

  async getTokenBalancesPerPosition({
    address,
    contractPosition,
    multicall,
  }: GetTokenBalancesParams<SpoolStaking, SpoolStakingDataProps>) {
    const suppliedToken = contractPosition.tokens.find(isSupplied)!;
    const rewardTokens = contractPosition.tokens.filter(isClaimable);

    const staking = this.contractFactory.spoolStaking({ address: STAKING_ADDRESS, network: this.network });
    const voSpool = this.contractFactory.spoolVospool({ address: VOSPOOL_ADDRESS, network: this.network });

    const [votingPowerRaw, voSpoolRewards, ...tokenRewards] = await Promise.all([
      multicall.wrap(voSpool).read.getUserGradualVotingPower([address]),
      multicall
        .wrap(staking)
        .simulate.getUpdatedVoSpoolRewardAmount({ account: address })
        .then(v => v.result),
      ...rewardTokens.map(reward => multicall.wrap(staking).read.earned([reward.address, address])),
    ]);

    const stakedSpool = await gqlFetch<UserSpoolStaking>({
      endpoint: SUBGRAPH_API_BASE_URL,
      query: SPOOL_STAKED_QUERY,
      variables: { address },
    });

    const stakedAmount = parseEther(stakedSpool?.userSpoolStaking?.spoolStaked || '0').toString();

    const rewardBalances = rewardTokens.map((token, idx) => {
      // Add voSPOOL rewards (always in SPOOL)
      const rewards =
        token.address.toLowerCase() == suppliedToken.address.toLowerCase()
          ? BigNumber.from(tokenRewards[idx]).add(voSpoolRewards)
          : BigNumber.from(tokenRewards[idx]);

      return rewards.toString();
    });

    return [stakedAmount, votingPowerRaw.toString(), ...rewardBalances];
  }
}
