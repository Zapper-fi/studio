import { ChainId } from '@kyberswap/ks-sdk-core';
import { Inject, Injectable } from '@nestjs/common';
import Axios from 'axios';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { CacheOnInterval } from '~cache/cache-on-interval.decorator';
import { Network } from '~types';

import { VAULT_ADDRESSES } from '../graphql/queries';
import UNIPILOT_DEFINITION from '../unipilot.definition';
import { SERVER_ENDPOINTS, SUBGRAPH_ENDPOINTS } from '../utils/constants';
import { ResponseAPRData, VaultAddressesResponse } from '../utils/generalTypes';
import { convertToQueryString } from '../utils/helpers';

@Injectable()
export class UnipilotVaultAPYHelper {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  //getting apys sepearately for each network
  @CacheOnInterval({
    key: `studio:${UNIPILOT_DEFINITION.id}:${UNIPILOT_DEFINITION.groups.pool.id}:unipilot-definitions-data`,
    timeout: 5 * 60 * 1000,
  })
  async getApy() {
    const ethData = await this.appToolkit.helpers.theGraphHelper.request<VaultAddressesResponse>({
      endpoint: SUBGRAPH_ENDPOINTS[Network.ETHEREUM_MAINNET].stats,
      query: VAULT_ADDRESSES,
    });

    const polygonData = await this.appToolkit.helpers.theGraphHelper.request<VaultAddressesResponse>({
      endpoint: SUBGRAPH_ENDPOINTS[Network.POLYGON_MAINNET].stats,
      query: VAULT_ADDRESSES,
    });

    const ethAddresses = ethData.vaults.map(vault => vault.id);
    const polygonAddresses = polygonData.vaults.map(vault => vault.id);

    const ethQueryParams = {
      vaultAddresses: ethAddresses.join(','),
      chainId: ChainId.MAINNET,
    };

    const ethQueryString = convertToQueryString(ethQueryParams);

    const polygonQueryParams = {
      vaultAddresses: polygonAddresses.join(','),
      chainId: ChainId.MATIC,
    };

    const polygonQueryString = convertToQueryString(polygonQueryParams);

    const [ethRes, polygonRes] = await Promise.all([
      Axios.get<any>(`${SERVER_ENDPOINTS}/aprs?${ethQueryString}`),
      Axios.get<any>(`${SERVER_ENDPOINTS}/aprs?${polygonQueryString}`),
    ]);

    let ethAprResponse: ResponseAPRData = {} as ResponseAPRData;
    let polygonAprResponse: ResponseAPRData = {} as ResponseAPRData;

    if (ethRes?.data?.message === 'Success' && polygonRes?.data?.message === 'Success') {
      const _ethCollection = ethRes.data.doc;
      const _polygonCollection = polygonRes.data.doc;
      if (_ethCollection && _polygonCollection) {
        ethAprResponse = Object.keys(_ethCollection).reduce((acc, curr) => {
          const { stats, avg24Hrs, avgAprWeekly } = _ethCollection[curr];
          return {
            ...acc,
            [curr]: {
              statsOnSpot: stats,
              stats: avg24Hrs.stats,
              stats7d: avgAprWeekly.stats,
            },
          };
        }, {} as ResponseAPRData);
        polygonAprResponse = Object.keys(_polygonCollection).reduce((acc, curr) => {
          const { stats, avg24Hrs, avgAprWeekly } = _polygonCollection[curr];
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

    const combineAprs = { ...ethAprResponse, ...polygonAprResponse };

    return combineAprs;
  }
}
