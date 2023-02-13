import { Injectable } from '@nestjs/common';
import Axios from 'axios';
import _ from 'lodash';

import { Cache } from '~cache/cache.decorator';
import { Network } from '~types/network.interface';

export type GammaApiTokensResponse = Record<string, Pool>;

type Pool = {
  tvlUSD: string;
};

@Injectable()
export class GammaStrategiesDefinitionResolver {
  @Cache({
    key: (network: Network) => `studio:gamma:${network}:vaults`,
    ttl: 30 * 60, // 30 min
  })
  async getPoolDefinitionsData(network: Network) {
    const url =
      network == Network.ETHEREUM_MAINNET
        ? 'https://gammawire.net/hypervisors/allData'
        : `https://gammawire.net/${network}/hypervisors/allData`;

    const { data } = await Axios.get<GammaApiTokensResponse>(url);
    return data;
  }

  async getPoolDefinitions(network: Network) {
    const definitionsData = await this.getPoolDefinitionsData(network);

    const definitionsDataRaw = Object.entries(definitionsData);

    const defintionsRaw = definitionsDataRaw.map(([key, value]) => {
      return Number(value.tvlUSD) > 0.01 ? { address: key.toLowerCase() } : null;
    });

    return _.compact(defintionsRaw);
  }
}
