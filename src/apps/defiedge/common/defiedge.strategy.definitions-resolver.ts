import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Cache } from '~cache/cache.decorator';
import { Network } from '~types/network.interface';

import { Strategy } from '../types/defiedge.types';
import { DEFIEDGE_BASE_URL } from '../utils';

@Injectable()
export class DefiEdgeStrategyDefinitionsResolver {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  @Cache({
    key: network => `studio:defiedge:${network}:strategies`,
    ttl: 5 * 60, // 5 minutes
  })
  async getStrategies(network: Network) {
    const networkParam = network === Network.ETHEREUM_MAINNET ? 'mainnet' : network;
    const endpoint = `${DEFIEDGE_BASE_URL}/${networkParam}/strategies`;

    const { data } = await axios.get<Strategy[]>(endpoint);
    return data;
  }
}
