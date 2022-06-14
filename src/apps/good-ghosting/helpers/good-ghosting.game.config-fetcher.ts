import { Injectable } from '@nestjs/common';

import axios from 'axios';
import { GamesResponse } from './constants';

@Injectable()
export class GoodGhostingGameConfigFetcherHelper {
  private async getGameConfigs(networkIdParam) {
    const url = `https://goodghosting-api.com/v1/games`;

    const response = await axios.get<GamesResponse>(url);
    const gameConfigs = response.data;
    const farms = [];

    const gameContractAddresses = Object.keys(gameConfigs);

    for (let i = 0; i < gameContractAddresses.length; i += 1) {
      const gameContractAddress = gameContractAddresses[i];
      const rewardTokenAddresses = [];

      const {
        depositTokenAddress,
        rewardTokenAddress,
        id,
        contractVersion,
        incentiveTokenAddress,
        networkId,
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
          contractVersion,
          gameName,
        });
      }
    }

    return farms;
  }
}
