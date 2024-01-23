import { Injectable } from '@nestjs/common';
import Axios from 'axios';

import { CacheOnInterval } from '~cache/cache-on-interval.decorator';
import { Network } from '~types/network.interface';

export type PickleJarData = {
  assets: {
    jars: {
      contract: string;
      chain: string;
      farm?: {
        farmAddress: string | null;
      };
    }[];
  };
};

const NETWORK_MAPPING = {
  [Network.ETHEREUM_MAINNET]: 'eth',
  [Network.POLYGON_MAINNET]: 'polygon',
  [Network.ARBITRUM_MAINNET]: 'arbitrum',
  [Network.OPTIMISM_MAINNET]: 'optimism',
  [Network.FANTOM_OPERA_MAINNET]: 'fantom',
  [Network.GNOSIS_MAINNET]: 'gnosis',
};

@Injectable()
export class PickleApiJarRegistry {
  @CacheOnInterval({
    key: `studio:pickle:jar:jar-definitions-data`,
    timeout: 5 * 60 * 1000,
    failOnMissingData: false,
  })
  private async getJarDefinitionsData() {
    const apyUrl = 'https://f8wgg18t1h.execute-api.us-west-1.amazonaws.com/prod/protocol/pfcore';
    const { data } = await Axios.get<PickleJarData>(apyUrl);
    return data;
  }

  async getJarDefinitions(network: Network) {
    const definitionsData = await this.getJarDefinitionsData();
    const networkId = NETWORK_MAPPING[network];

    const jarsDefinitionRaw = definitionsData.assets.jars.filter(jar => jar.chain === networkId);

    return jarsDefinitionRaw.map(jar => ({
      jarAddress: jar.contract.toLowerCase(),
      gaugeAddress: jar.farm?.farmAddress?.toLowerCase() ?? null,
    }));
  }
}
