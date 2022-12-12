import { Injectable } from '@nestjs/common';
import Axios from 'axios';

import { CacheOnInterval } from '~cache/cache-on-interval.decorator';
import { Network } from '~types/network.interface';

import { PICKLE_DEFINITION } from '../pickle.definition';

export type PicklePoolDetails = {
  identifier: string;
  liquidity_locked: number;
  apy: number;
  jarApy: number;
  tokenAddress: string;
  jarAddress: string;
  gaugeAddress: string | null;
  tokens: number;
  ratio: number;
  network: string;
};

const NETWORK_MAPPING = {
  [Network.ETHEREUM_MAINNET]: 'eth',
  [Network.POLYGON_MAINNET]: 'polygon',
  [Network.ARBITRUM_MAINNET]: 'arbitrum',
  [Network.MOONRIVER_MAINNET]: 'moonriver',
  [Network.OPTIMISM_MAINNET]: 'optimism',
  [Network.FANTOM_OPERA_MAINNET]: 'fantom',
  [Network.GNOSIS_MAINNET]: 'gnosis',
  [Network.AURORA_MAINNET]: 'aurora',
};

@Injectable()
export class PickleApiJarRegistry {
  @CacheOnInterval({
    key: `studio:${PICKLE_DEFINITION.id}:${PICKLE_DEFINITION.groups.jar.id}:jar-definitions-data`,
    timeout: 5 * 60 * 1000,
    failOnMissingData: false,
  })
  private async getJarDefinitionsData() {
    const apyUrl = 'https://api.pickle.finance/prod/protocol/pools';
    const data = await Axios.get<PicklePoolDetails[]>(apyUrl).then(v => v.data);
    return data;
  }

  async getJarDefinitions(opts: { network: Network }) {
    const definitionsData = await this.getJarDefinitionsData();

    return definitionsData
      .filter(({ network, liquidity_locked }) => network === NETWORK_MAPPING[opts.network] && liquidity_locked > 1000)
      .map(({ tokenAddress, jarAddress, gaugeAddress, apy = 0 }) => ({
        tokenAddress: tokenAddress.toLowerCase(),
        vaultAddress: jarAddress.toLowerCase(),
        gaugeAddress: gaugeAddress?.toLowerCase() ?? null,
        apy,
      }));
  }
}
