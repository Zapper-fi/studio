import { Inject, Injectable } from '@nestjs/common';
import { GamesResponse } from './constants';
import axios from 'axios';

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

      const { depositTokenAddress, rewardTokenAddress, id, contractVersion, incentiveTokenAddress, networkId } =
        gameConfigs[gameContractAddress];

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
        });
      }
    }

    return farms;
  }
}
