import { Injectable } from '@nestjs/common';
import Axios from 'axios';
import _ from 'lodash';

import { Cache } from '~cache/cache.decorator';
import { Network } from '~types/network.interface';

export type GammaApiTokensResponse = Record<string, Pool>;

type Pool = {
  returns: {
    allTime: {
      feeApy: number;
    };
  };
};

const dataSources = {
  [Network.ARBITRUM_MAINNET]: ['/arbitrum', '/zyberswap/arbitrum'],
  [Network.ETHEREUM_MAINNET]: [''],
  [Network.OPTIMISM_MAINNET]: ['/optimism'],
  [Network.POLYGON_MAINNET]: ['/polygon', '/quickswap/polygon'],
  [Network.CELO_MAINNET]: ['/celo'],
};

@Injectable()
export class GammaStrategiesDefinitionResolver {
  @Cache({
    key: (network: Network) => `studio:gamma:${network}:vaults`,
    ttl: 30 * 60, // 30 min
  })
  async getPoolDefinitionsData(network: Network) {
    const urls = dataSources[network];
    const data = await Promise.all(
      urls.map((path: string) => this._getPoolDefinitionsData(`https://wire2.gamma.xyz${path}/hypervisors/allData`)),
    );
    return Object.assign({}, ...data) as GammaApiTokensResponse;
  }

  async _getPoolDefinitionsData(url: string) {
    const { data } = await Axios.get<GammaApiTokensResponse>(url);
    return data;
  }

  async getPoolDefinitions(network: Network) {
    const definitionsData = await this.getPoolDefinitionsData(network);

    const definitionsDataRaw = Object.entries(definitionsData);

    const defintionsRaw = definitionsDataRaw.map(([key, value]) => {
      return Number(value.returns.allTime.feeApy) > 0 ? { address: key.toLowerCase() } : null;
    });
    return _.compact(defintionsRaw);
  }
}
