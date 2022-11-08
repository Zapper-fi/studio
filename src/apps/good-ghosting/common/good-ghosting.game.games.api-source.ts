import { Injectable } from '@nestjs/common';
import axios from 'axios';

import { CacheOnInterval } from '~cache/cache-on-interval.decorator';
import { Network, NETWORK_IDS } from '~types';

import GOOD_GHOSTING_DEFINITION from '../good-ghosting.definition';

import { NetworkId, getGameVersionType, RewardType, BASE_API_URL, GamesResponse } from './good-ghosting.game.constants';

@Injectable()
export class GoodGhostingGameGamesApiSource {
  @CacheOnInterval({
    key: `studio:${GOOD_GHOSTING_DEFINITION.id}:${GOOD_GHOSTING_DEFINITION.groups.game}:addresses`,
    timeout: 15 * 60 * 1000,
  })
  async getCachedGameConfigsData() {
    const url = `${BASE_API_URL}/games`;
    const response = await axios.get<GamesResponse>(url);
    return response.data;
  }

  async getGameConfigs(network: Network) {
    const farms: {
      address: string;
      stakedTokenAddress: string;
      rewardTokenAddresses: string[];
      contractVersion: string;
      strategyProvider: string;
      gameName: string;
    }[] = [];

    const networkIdParam = NETWORK_IDS[network];
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

      if (isV2Game && rewards) {
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

      if (depositTokenAddress && contractVersion && id && networkId && Number(networkId) === networkIdParam) {
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
}
