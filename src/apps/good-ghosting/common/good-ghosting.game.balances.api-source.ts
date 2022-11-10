import axios from 'axios';

import { Network, NETWORK_IDS } from '~types';

import {
  BASE_API_URL,
  PlayerResponse,
  PlayerBalance,
  transformRewardArrayToObject,
  RewardType,
} from './good-ghosting.game.constants';

export class GoodGhostingGameBalancesApiSource {
  async getBalances(address: string, network: Network) {
    const url = `${BASE_API_URL}/players/active-games?networkId=${NETWORK_IDS[network]}&playerAddress=${address}`;
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
        playerRewardAmount = String(0);
        playerIncentiveAmount = String(0);

        if (playerRewards[RewardType.Incentive]) {
          playerIncentiveAmount = playerRewards[RewardType.Incentive].balance;
        }

        if (playerRewards[RewardType.Reward]) {
          playerRewardAmount = playerRewards[RewardType.Reward].balance;
        }
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
