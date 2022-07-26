import { Injectable } from '@nestjs/common';
import axios, { Axios } from 'axios';

import { Network } from '~types/network.interface';

import { GaugeType, GetFactoryGaugesResponse } from './curve.api.types';

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
}
