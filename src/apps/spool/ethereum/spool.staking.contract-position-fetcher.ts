import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';
import { gql } from 'graphql-request';
import _ from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem, buildNumberDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { SpoolContractFactory } from '~apps/spool';
import { STAKING_ADDRESS, SUBGRAPH_API_BASE_URL, VOSPOOL_ADDRESS } from '~apps/spool/ethereum/spool.constants';
import { StakingReward } from '~apps/spool/ethereum/spool.types';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { claimable, supplied, vesting } from '~position/position.utils';
import { BaseToken } from '~position/token.interface';
import { Network } from '~types/network.interface';

import { SPOOL_DEFINITION } from '../spool.definition';

const appId = SPOOL_DEFINITION.id;
const groupId = SPOOL_DEFINITION.groups.staking.id;
const spoolTokenAddress = SPOOL_DEFINITION.token!.address;
const network = Network.ETHEREUM_MAINNET;
const big10 = BigNumber.from(10);

const rewardsQuery = gql`
  query {
    stakingRewardTokens {
      id
      token {
        id
        name
        symbol
        decimals
      }
      isRemoved
      endTime
      startTime
    }
  }
`;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumSpoolStakingContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(SpoolContractFactory) private readonly spoolContractFactory: SpoolContractFactory,
  ) {}

  async getPositions() {
    const multicall = this.appToolkit.getMulticall(network);
    const stakingRewards = await this.appToolkit.helpers.theGraphHelper.requestGraph<StakingReward>({
      endpoint: SUBGRAPH_API_BASE_URL,
      query: rewardsQuery,
    });

    const now = parseInt(String(new Date().getTime() / 1000));
    const voSpoolContract = this.spoolContractFactory.spoolVospool({ network, address: VOSPOOL_ADDRESS });
    const [voSpoolSymbol, voSpoolDecimals, votingPowerRaw] = await Promise.all([
      multicall.wrap(voSpoolContract).symbol(),
      multicall.wrap(voSpoolContract).decimals(),
      multicall.wrap(voSpoolContract).getTotalGradualVotingPower(),
    ]);

    const stakedToken = (await this.appToolkit.getBaseTokenPrice({ network, address: spoolTokenAddress }))!;
    const govToken: BaseToken = {
      type: ContractType.BASE_TOKEN,
      address: VOSPOOL_ADDRESS,
      network,
      price: 0,
      symbol: voSpoolSymbol,
      decimals: voSpoolDecimals,
    };

    // SpoolStaking can emit arbitrary tokens
    // VoSpoolRewards always emits SPOOL
    const rewardAddresses = _.uniq(
      stakingRewards.stakingRewardTokens
        .filter(reward => !reward.isRemoved && parseInt(reward.startTime) >= now && parseInt(reward.endTime) <= now)
        .map(reward => reward.token.id)
        .concat([spoolTokenAddress]),
    );

    const rewardTokens = await Promise.all(
      rewardAddresses.map(address => this.appToolkit.getBaseTokenPrice({ network, address })),
    );

    const tokens = rewardTokens.filter((token): token is BaseToken => token !== null).map(claimable);
    tokens.push(supplied(stakedToken!));
    tokens.push(vesting(govToken));

    const spoolContract = this.spoolContractFactory.erc20({ network, address: spoolTokenAddress });
    const totalStaked = await spoolContract.balanceOf(STAKING_ADDRESS);
    const spoolStaked = totalStaked.div(big10.pow(stakedToken!.decimals)).toNumber();
    const totalAccVoSpool = votingPowerRaw.div(big10.pow(voSpoolDecimals)).toNumber();

    const pricePrecision = 10 ** 10;
    const tvl = BigNumber.from(pricePrecision * stakedToken!.price)
      .mul(totalStaked)
      .div(pricePrecision)
      .div(big10.pow(stakedToken!.decimals))
      .toNumber();

    const position: ContractPosition = {
      type: ContractType.POSITION,
      appId,
      groupId,
      address: STAKING_ADDRESS,
      network,
      tokens,
      dataProps: {
        tvl,
        spoolStaked,
        totalAccVoSpool,
      },
      displayProps: {
        label: 'SPOOL Staking',
        images: getImagesFromToken(stakedToken),
        statsItems: [
          { label: 'TVL', value: buildDollarDisplayItem(tvl) },
          { label: 'SPOOL Staked', value: buildNumberDisplayItem(spoolStaked) },
          { label: 'voSPOOL Accumulated', value: buildNumberDisplayItem(totalAccVoSpool) },
        ],
      },
    };

    return _.compact([position]);
  }
}
