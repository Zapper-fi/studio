import { Injectable } from '@nestjs/common';
import axios from 'axios';

import { SingleStakingFarmDefinition } from '~app-toolkit';

import { GamesResponse } from './constants';

@Injectable()
export class GoodGhostingGameConfigFetcherHelper {
  async getGameConfigs(networkIdParam: string) {
    const url = `https://goodghosting-api.com/v1/games`;

    const response = await axios.get<GamesResponse>(url);
    const gameConfigs = response.data;
    const farms: (SingleStakingFarmDefinition & { contractVersion: string })[] = [];

    const gameContractAddresses = Object.keys(gameConfigs);

    for (let i = 0; i < gameContractAddresses.length; i += 1) {
      const gameContractAddress = gameContractAddresses[i];
      const rewardTokenAddresses: string[] = [];

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
