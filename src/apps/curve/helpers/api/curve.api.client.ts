import { Injectable } from '@nestjs/common';
import axios, { Axios } from 'axios';

import { Network } from '~types/network.interface';

import { GetFactoryGaugesResponse } from './curve.api.types';

@Injectable()
export class CurveApiClient {
  private readonly axiosInstance: Axios;

  constructor() {
    this.axiosInstance = axios.create({ baseURL: 'https://api.curve.fi/api' });
  }

  async getMainGauges(network: Network) {
    return this.axiosInstance.get<GetFactoryGaugesResponse>(`/getGauges`).then(res =>
      Object.entries(res.data.data.gauges)
        .filter(([id]) => id.startsWith(network))
        .map(([_, v]) => ({
          swapAddress: v.swap.toLowerCase(),
          gaugeAddress: v.gauge.toLowerCase(),
        })),
    );
  }

  async getFactoryGauges(network: Network) {
    return this.axiosInstance.get<GetFactoryGaugesResponse>(`/getFactoGauges/${network}`).then(res =>
      res.data.data.gauges.map(v => ({
        swapAddress: v.swap.toLowerCase(),
        gaugeAddress: v.gauge.toLowerCase(),
      })),
    );
  }
}
