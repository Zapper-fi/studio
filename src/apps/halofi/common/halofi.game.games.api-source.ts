import { Injectable } from '@nestjs/common';
import axios from 'axios';

import { CacheOnInterval } from '~cache/cache-on-interval.decorator';
import { Network, NETWORK_IDS } from '~types';

import {
  getGameVersionType,
  BASE_API_URL,
  GamesResponse,
  retry,
  sendRequestWithThrottle,
} from './halofi.game.constants';

@Injectable()
export class HalofiGameGamesApiSource {
  async getGames() {
    const url = `${BASE_API_URL}/games`;
    return sendRequestWithThrottle(axios.get<GamesResponse>(url));
  }

  @CacheOnInterval({
    key: `studio:halofi:game:addresses`,
    timeout: 15 * 60 * 1000,
    failOnMissingData: false,
  })
  async getCachedGameConfigsData() {
    const response = await retry(this.getGames, []);
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

      const { depositTokenAddress, id, contractVersion, networkId, strategyProvider, gameNameShort, gameName } =
        gameConfigs[gameContractAddress];
      const isV2Game = getGameVersionType(contractVersion);

      if (
        depositTokenAddress &&
        contractVersion &&
        isV2Game &&
        id &&
        networkId &&
        Number(networkId) === networkIdParam
      ) {
        farms.push({
          address: id,
          stakedTokenAddress: depositTokenAddress,
          rewardTokenAddresses: [],
          strategyProvider,
          contractVersion,
          gameName: gameNameShort ?? gameName,
        });
      }
    }

    return farms;
  }
}
