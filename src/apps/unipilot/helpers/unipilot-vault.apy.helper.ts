import { ChainId } from '@kyberswap/ks-sdk-core';
import { Inject, Injectable } from '@nestjs/common';
import Axios from 'axios';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Cache } from '~cache/cache.decorator';
import { Network } from '~types';

import { VAULT_ADDRESSES } from '../graphql/queries';
import UNIPILOT_DEFINITION from '../unipilot.definition';
import { SERVER_ENDPOINTS, SUBGRAPH_ENDPOINTS } from '../utils/constants';
import { ResponseAPRData, VaultAddressesResponse } from '../utils/generalTypes';
import { convertToQueryString } from '../utils/helpers';

@Injectable()
export class UnipilotVaultAPYHelper {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  @Cache({
    key: network => `studio:unipilot:${network}:vault-addresses`,
    ttl: 5 * 60, // 5 minutes
  })
  async getAddresses(network: Network) {
    const data = await this.appToolkit.helpers.theGraphHelper.request<VaultAddressesResponse>({
      endpoint: SUBGRAPH_ENDPOINTS[network].stats,
      query: VAULT_ADDRESSES,
    });

    const vaultAddresses = data.vaults.map(vault => vault.id);
    return vaultAddresses;
  }

  @Cache({
    key: network =>
      `studio:${network}:${UNIPILOT_DEFINITION.id}:${UNIPILOT_DEFINITION.groups.pool.id}:unipilot-definitions-data`,
    ttl: 5 * 60,
  })
  async getApy(network: Network) {
    const addresses = await this.getAddresses(network);

    const queryParams = {
      vaultAddresses: addresses.join(','),
      chainId: Network.ETHEREUM_MAINNET === network ? ChainId.MAINNET : ChainId.MATIC,
    };

    const queryString = convertToQueryString(queryParams);

    const res = await Axios.get<any>(`${SERVER_ENDPOINTS}/aprs?${queryString}`);

    let aprResponse: ResponseAPRData = {} as ResponseAPRData;

    if (res?.data?.message === 'Success') {
      const _collection = res.data.doc;
      if (_collection) {
        aprResponse = Object.keys(_collection).reduce((acc, curr) => {
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

    return aprResponse;
  }
}
