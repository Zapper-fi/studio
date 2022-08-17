import { Injectable } from '@nestjs/common';
import axios from 'axios';

import { SingleStakingFarmDefinition } from '~app-toolkit';
import { CacheOnInterval } from '~cache/cache-on-interval.decorator';
import { NetworkId, getGameVersionType, RewardType, transformRewardArrayToObject } from '../helpers/constants';

import GOOD_GHOSTING_DEFINITION from '../good-ghosting.definition';
import { NetworkId } from '../helpers/constants';

import { GamesResponse, PlayerBalance, PlayerResponse, BASE_API_URL } from './constants';

@Injectable()
export class GoodGhostingGameConfigFetcherHelper {
  @CacheOnInterval({
    key: `studio:${GOOD_GHOSTING_DEFINITION.id}:${GOOD_GHOSTING_DEFINITION.groups.game}:addresses`,
    timeout: 15 * 60 * 1000,
  })
  async getCachedGameConfigsData() {
    const url = `${BASE_API_URL}/games`;
    const response = await axios.get<GamesResponse>(url);
    return response.data;
  }

  async getGameConfigs(networkIdParam: string) {
    const farms: (SingleStakingFarmDefinition & {
      contractVersion: string;
      strategyProvider: string;
      gameName: string;
    })[] = [];
    const gameConfigs = await this.getCachedGameConfigsData();
    const gameContractAddresses = Object.keys(gameConfigs);

    for (let i = 0; i < gameContractAddresses.length; i += 1) {
      const gameContractAddress = gameContractAddresses[i];
      let rewardTokenAddresses: string[] = [];
      const rewardTokens: Record<string, string> = {};

      const {
        depositTokenAddress,
        rewardTokenAddress,
        id,
        contractVersion,
        incentiveTokenAddress,
        networkId,
        strategyProvider,
        gameName,
        rewards,
      } = gameConfigs[gameContractAddress];

      const isV2Game = getGameVersionType(contractVersion);
      const isPolygonGame = NetworkId.PolygonMainnet === networkId;
      const isCeloGame = NetworkId.CeloMainnet === networkId;

      if (isV2Game) {
        rewards.map(reward => {
          rewardTokens[reward.type] = reward.address;
          rewardTokens[RewardType.Deposit] = depositTokenAddress;
        });

        const rewardTokenAddress = Object.values(rewardTokens);
        rewardTokenAddresses = [...rewardTokenAddress];
      }

      if (isPolygonGame && rewardTokenAddress) {
        rewardTokenAddresses.push(rewardTokenAddress);
        rewardTokenAddresses.push(depositTokenAddress);
      }

      if (isPolygonGame && rewardTokenAddress && incentiveTokenAddress) {
        rewardTokenAddresses.push(incentiveTokenAddress);
      }

      if (isCeloGame && incentiveTokenAddress) {
        rewardTokenAddresses.push(incentiveTokenAddress);
        rewardTokenAddresses.push(depositTokenAddress);
      }

      if (depositTokenAddress && contractVersion && id && networkId && networkId === networkIdParam) {
        farms.push({
          address: id,
          stakedTokenAddress: depositTokenAddress,
          rewardTokenAddresses,
          strategyProvider,
          contractVersion,
          gameName,
        });
      }
    }

    return farms;
  }

  async getPlayerGameBalances(playerAddress: string, networkId: string) {
    const url = `${BASE_API_URL}/players/active-games?networkId=${networkId}&playerAddress=${playerAddress}`;
    const response = await axios.get<PlayerResponse[]>(url);

    const player = response.data;
    const balances: Record<string, PlayerBalance> = {};

    for (let i = 0; i < player.length; i += 1) {
      const {
        gameId,
        incentiveAmount,
        interestAmount,
        withdrawn,
        isWinner,
        paidAmount,
        playerId,
        rewardAmount,
        totalEarningsConverted,
        gameAPY,
        rewards,
      } = player[i];

      let playerIncentiveAmount = incentiveAmount;
      let playerRewardAmount = rewardAmount;

      if (rewards) {
        const playerRewards = transformRewardArrayToObject(rewards);

        playerIncentiveAmount = playerRewards[RewardType.Incentive] ? playerRewards[RewardType.Incentive].balance : 0;
        playerRewardAmount = playerRewards[RewardType.Reward] ? playerRewards[RewardType.Reward].balance : 0;
      }

      balances[gameId] = {
        incentiveAmount: parseFloat(parseFloat(playerIncentiveAmount).toFixed(3)),
        interestAmount: parseFloat(parseFloat(interestAmount).toFixed(3)),
        withdrawn,
        isWinner,
        paidAmount: parseFloat(paidAmount),
        rewardAmount: parseFloat(parseFloat(playerRewardAmount).toFixed(3)),
        poolAPY: parseFloat(gameAPY),
        pooltotalEarningsConverted: parseFloat(parseFloat(totalEarningsConverted).toFixed(3)),
        playerId,
      };
    }

    return balances;
  }
}
