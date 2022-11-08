import { Inject, Injectable } from '@nestjs/common';
import Axios from 'axios';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Cache } from '~cache/cache.decorator';
import { Network } from '~types/network.interface';

import { UNIPILOT_VAULTS, UNIPILOT_VAULTS_POLYGON } from '../graphql/queries';
import { SERVER_ENDPOINTS, SUBGRAPH_ENDPOINTS } from '../utils/constants';
import { ResponseAPRData, UnipilotVaultDefinition, UnipilotVaultFetcherResponse } from '../utils/generalTypes';

@Injectable()
export class UnipilotVaultDefinitionsResolver {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  @Cache({
    key: network => `studio:unipilot:${network}:pool-data`,
    ttl: 5 * 60, // 5 minutes
  })
  private async getVaultDefinitionsData(network: Network) {
    if (network === Network.ETHEREUM_MAINNET) {
      const data = await this.appToolkit.helpers.theGraphHelper.request<UnipilotVaultFetcherResponse>({
        endpoint: SUBGRAPH_ENDPOINTS[Network.ETHEREUM_MAINNET].stats,
        query: UNIPILOT_VAULTS,
        variables: {
          first: 1000,
        },
      });

      return data.vaults;
    } else {
      const data = await this.appToolkit.helpers.theGraphHelper.request<UnipilotVaultFetcherResponse>({
        endpoint: SUBGRAPH_ENDPOINTS[Network.POLYGON_MAINNET].stats,
        query: UNIPILOT_VAULTS_POLYGON,
        variables: {
          first: 1000,
        },
      });

      return data.vaults;
    }
  }

  @Cache({
    key: network => `studio:unipilot:${network}:pool-data-aprs`,
    ttl: 5 * 60, // 5 minutes
  })
  private async getFeesAPR(network: Network): Promise<ResponseAPRData | undefined> {
    const data = await this.getVaultDefinitionsData(network);

    const vaults = data.map(vault => vault.id).join(',');

    const res = await Axios.get<any>(`${SERVER_ENDPOINTS}/aprs?${vaults}`);

    if (res?.data?.message === 'Success') {
      const _collection = res.data.doc;
      if (!_collection) return;

      return Object.keys(_collection).reduce((acc, curr) => {
        const { stats, avg24Hrs, avgAprWeekly } = _collection[curr];
        return {
          ...acc,
          [curr]: {
            statsOnSpot: stats,
            stats: avg24Hrs.stats,
            stats7d: avgAprWeekly.stats,
          },
        };
      }, {} as ResponseAPRData);
    }
  }

  async getVaultDefinitions(network: Network): Promise<UnipilotVaultDefinition[]> {
    const vaultsDefinitionsData = await this.getVaultDefinitionsData(network);

    const vaultsDefinitions = vaultsDefinitionsData.map(vault => {
      return {
        address: vault.id,
        token0Address: vault.token0.id,
        token1Address: vault.token1.id,
        feeTier: vault.feeTier,
        token0Symbol: vault.token0.symbol,
        token1Symbol: vault.token1.symbol,
        strategyId: vault.strategyId,
        totalLockedToken0: vault.totalLockedToken0,
        totalLockedToken1: vault.totalLockedToken1,
      };
    });

    return vaultsDefinitions;
  }

  async getVaultDefinitionsDetails(network: Network) {
    const vaults = await this.getVaultDefinitionsData(network);

    return vaults;
  }

  async getAprs(vaultAddress: string, network: Network) {
    const aprs = await this.getFeesAPR(network);

    if (aprs) {
      return parseFloat(aprs[vaultAddress].stats7d);
    }

    return 0;
  }
}
