import { Injectable } from '@nestjs/common';
import Axios from 'axios';

import { Cache } from '~cache/cache.decorator';
import { Network, NETWORK_IDS } from '~types/network.interface';

export type YearnVaultData = {
  address: string;
  endorsed: boolean;
  name: string;
  token: {
    address: string;
  };
  apy: {
    net_apy: number;
  };
};

@Injectable()
export class YearnVaultTokenDefinitionsResolver {
  @Cache({
    key: network => `studio:yearn:${network}:vault-data-test`,
    ttl: 5 * 60, // 5 minutes
  })
  private async getVaultDefinitionsData(network: Network) {
    const url = `https://ydaemon.yearn.finance/${NETWORK_IDS[network]}/vaults/all`;
    const { data } = await Axios.get<YearnVaultData[]>(url);
    return data;
  }

  async getVaultDefinitions(network: Network) {
    const definitionsData = await this.getVaultDefinitionsData(network);

    return definitionsData
      .filter(vault => !!vault.endorsed) // Remove experimental v2 vaults
      .map(vault => {
        return {
          address: vault.address,
          underlyingTokenAddress: vault.token.address.toLowerCase(),
          apy: vault.apy.net_apy * 100,
        };
      });
  }
}
