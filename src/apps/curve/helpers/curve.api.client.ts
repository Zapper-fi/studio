import { Injectable } from '@nestjs/common';
import axios, { Axios } from 'axios';

import { Network } from '~types/network.interface';

import { GetFactoryGaugesResponse, GetPoolApyDataResponse, TO_CURVE_NETWORK } from './curve.api.types';
import { REWARDS_ONLY_GAUGES } from './curve.gauge.rewards-only';

@Injectable()
export class CurveApiClient {
  private readonly axiosInstance: Axios;

  constructor() {
    this.axiosInstance = axios.create({ baseURL: 'https://api.curve.fi/api' });
  }

  async getGauges(network: Network) {
    const gauges = await this.axiosInstance.get<GetFactoryGaugesResponse>(`/getGauges`).then(res =>
      Object.entries(res.data.data.gauges)
        .filter(([id]) => {
          const curveNetwork = this.toCurveNetwork(network);
          if (network !== Network.ETHEREUM_MAINNET) return id.startsWith(curveNetwork);
          // @TODO Super dangerous check... if Curve adds another network, this will break.
          // Or, when we removed networks, this will break. BAD.
          // Downstream, we do match on the `swapAddress` to attempt to filter out anything unwanted
          // ...but the problem is that swap addresses also exist across networks!
          const curveAltNetworks = [...Object.values(TO_CURVE_NETWORK), 'harmony'];
          const otherNetworks = curveAltNetworks.filter(v => v !== curveNetwork);
          return !otherNetworks.some(v => id.startsWith(v));
        })
        .filter(([_, v]) => !v.is_killed)
        .map(([_, v]) => ({
          swapAddress: v.swap.toLowerCase(),
          gaugeAddress: v.gauge.toLowerCase(),
        }))
        .concat(...(REWARDS_ONLY_GAUGES[network] ?? [])),
    );

    return gauges;
  }

  async getPoolApyData(network: Network) {
    return this.axiosInstance
      .get<GetPoolApyDataResponse>(`/getSubgraphData/${this.toCurveNetwork(network)}`)
      .then(res =>
        res.data.data.poolList.map(v => ({
          swapAddress: v.address.toLowerCase(),
          apy: Number(v.latestDailyApy),
          volume: v.volumeUSD,
        })),
      );
  }

  private toCurveNetwork(network: Network) {
    return TO_CURVE_NETWORK[network];
  }
}
