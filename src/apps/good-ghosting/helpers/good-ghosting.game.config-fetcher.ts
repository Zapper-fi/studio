import { Injectable } from '@nestjs/common';
import axios from 'axios';

import { SingleStakingFarmDefinition } from '~app-toolkit';
import { CacheOnInterval } from '~cache/cache-on-interval.decorator';
import { Network } from '~types';

import GOOD_GHOSTING_DEFINITION from '../good-ghosting.definition';

import { GamesResponse } from './constants';

@Injectable()
export class GoodGhostingGameConfigFetcherHelper {
  @CacheOnInterval({
    key: `studio:${GOOD_GHOSTING_DEFINITION.id}:${GOOD_GHOSTING_DEFINITION.groups.game}:${Network.POLYGON_MAINNET}:addresses`,
    timeout: 15 * 60 * 1000,
  })
  async getCachedGameConfigsData() {
    const url = `https://goodghosting-api.com/v1/games`;
    const response = await axios.get<GamesResponse>(url);
    return response.data;
  }

  async getGameConfigs(networkIdParam: string) {
    const farms: (SingleStakingFarmDefinition & { contractVersion: string })[] = [];
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
}
