import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Cache } from '~cache/cache.decorator';
import { Network } from '~types/network.interface';

export interface Strategy {
  id: string;
  pool: string;
  token0: {
    id: string;
  };
  token1: {
    id: string;
  };
  subTitle: string | null;
  title: string;
}

export const DEFIEDGE_BASE_URL = 'https://api.defiedge.io';

const networkNameMap: Partial<Record<Network, string>> = {
  [Network.ETHEREUM_MAINNET]: 'mainnet',
  [Network.BINANCE_SMART_CHAIN_MAINNET]: 'bsc',
};

const networkToDefiParams = (network: Network) => networkNameMap[network] ?? network;

@Injectable()
export class DefiedgeStrategyDefinitionsResolver {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  @Cache({
    key: network => `studio:defiedge:${network}:strategies`,
    ttl: 5 * 60, // 5 minutes
  })
  async getStrategies(network: Network) {
    const networkParam = networkToDefiParams(network);
    const endpoint = `${DEFIEDGE_BASE_URL}/${networkParam}/strategies`;

    const { data } = await axios.get<Strategy[]>(endpoint);
    return data;
  }
}
