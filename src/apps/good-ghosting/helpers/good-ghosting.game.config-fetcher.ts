import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GoodGhostingGameConfigFetcherHelper {
  private async getGameConfigs() {
    const url = `https://goodghosting-api.com/v1/games`;

    const response = await axios.get<any>(url);
    const gameConfigs = response.data;
    const farms = [];

    const gameContractAddresses = Object.keys(gameConfigs);

    for (let i = 0; i < gameContractAddresses.length; i += 1) {
      const gameContractAddress = gameContractAddresses[i];
      const rewardTokenAddresses = [];

      const { depositTokenAddress, rewardTokenAddress, id, contractVersion, incentiveTokenAddress } =
        gameConfigs[gameContractAddress];

      if (rewardTokenAddress) {
        rewardTokenAddresses.push(rewardTokenAddress);
      }

      if (incentiveTokenAddress) {
        rewardTokenAddresses.push(incentiveTokenAddress);
      }

      if (depositTokenAddress && contractVersion && id) {
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
