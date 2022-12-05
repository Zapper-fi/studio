import { Injectable } from '@nestjs/common';
import Axios from 'axios';
import { values } from 'lodash';

import { Cache } from '~cache/cache.decorator';
import { Network } from '~types/network.interface';

export type BadgerApiTokensResponseEntry = {
  address: string;
  decimals: number;
  name: string;
  symbol: string;
  type: string;
  vaultToken: {
    address: string;
    network: string;
  };
};

export type BadgerApiTokensResponse = Record<string, BadgerApiTokensResponseEntry>;

@Injectable()
export class BadgerVaultTokenDefinitionsResolver {
  @Cache({
    key: network => `studio:badger:${network}:vault-data`,
    ttl: 5 * 60, // 60 minutes
  })
  private async getVaultDefinitionsData(network: Network) {
    const { data } = await Axios.get<BadgerApiTokensResponse>(`https://api.badger.com/v2/tokens?chain=${network}`);
    return data;
  }

  async getVaultDefinitions(network: Network) {
    const definitionsData = await this.getVaultDefinitionsData(network);

    const vaultDefinitions = values(definitionsData)
      .filter(t => t.type === 'Vault')
      .map(t => ({ address: t.address.toLowerCase(), underlyingTokenAddress: t.vaultToken.address.toLowerCase() }));
    return vaultDefinitions;
  }
}
