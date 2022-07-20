import { Injectable } from '@nestjs/common';
import axios from 'axios';

import { SingleStakingFarmDefinition } from '~app-toolkit';
import { CacheOnInterval } from '~cache/cache-on-interval.decorator';

import GOOD_GHOSTING_DEFINITION from '../good-ghosting.definition';

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
      const rewardTokenAddresses: string[] = [];

      const {
        depositTokenAddress,
        rewardTokenAddress,
        id,
        contractVersion,
        incentiveTokenAddress,
        networkId,
        strategyProvider,
        gameName,
      } = gameConfigs[gameContractAddress];

      if (rewardTokenAddress) {
        rewardTokenAddresses.push(rewardTokenAddress);
        rewardTokenAddresses.push(depositTokenAddress);
      }

      if (rewardTokenAddress && incentiveTokenAddress) {
        rewardTokenAddresses.push(incentiveTokenAddress);
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
      } = player[i];

      balances[gameId] = {
        incentiveAmount: parseFloat(parseFloat(incentiveAmount).toFixed(3)),
        interestAmount: parseFloat(parseFloat(interestAmount).toFixed(3)),
        withdrawn,
        isWinner,
        paidAmount: parseFloat(paidAmount),
        rewardAmount: parseFloat(parseFloat(rewardAmount).toFixed(3)),
        poolAPY: parseFloat(gameAPY),
        pooltotalEarningsConverted: parseFloat(parseFloat(totalEarningsConverted).toFixed(3)),
        playerId,
      };
    }
    return balances;
  }
}
