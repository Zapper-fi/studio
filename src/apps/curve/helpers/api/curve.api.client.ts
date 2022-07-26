import { Injectable } from '@nestjs/common';
import axios, { Axios } from 'axios';

import { Network } from '~types/network.interface';

import { GaugeType, GetFactoryGaugesResponse, GetPoolApyDataResponse } from './curve.api.types';

@Injectable()
export class CurveApiClient {
  private readonly axiosInstance: Axios;

  constructor() {
    this.axiosInstance = axios.create({ baseURL: 'https://api.curve.fi/api' });
  }

  async getGauges(network: Network) {
    return this.axiosInstance.get<GetFactoryGaugesResponse>(`/getGauges`).then(res =>
      Object.entries(res.data.data.gauges)
        .filter(([id]) => id.startsWith(network))
        .filter(([_, v]) => !v.is_killed)
        .map(([_, v]) => ({
          type: GaugeType.MAIN,
          swapAddress: v.swap.toLowerCase(),
          gaugeAddress: v.gauge.toLowerCase(),
        })),
    );
  }

  async getPoolApyData(network: Network) {
    return this.axiosInstance.get<GetPoolApyDataResponse>(`/getSubgraphData/${network}`).then(res =>
      res.data.data.poolList.map(v => ({
        swapAddress: v.address.toLowerCase(),
        apy: Number(v.latestDailyApy),
        volume: v.volumeUSD,
      })),
    );
  }
}
