import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import DataLoader from 'dataloader';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

export const TO_CURVE_NETWORK = {
  [Network.ETHEREUM_MAINNET]: 'ethereum',
  [Network.ARBITRUM_MAINNET]: 'arbitrum',
  [Network.AVALANCHE_MAINNET]: 'avalanche',
  [Network.FANTOM_OPERA_MAINNET]: 'fantom',
  [Network.GNOSIS_MAINNET]: 'xdai',
  [Network.OPTIMISM_MAINNET]: 'optimism',
  [Network.POLYGON_MAINNET]: 'polygon',
};

export type PoolApyData = {
  type: string;
  address: string;
  volumeUSD: number;
  rawVolume: number;
  latestDailyApy: number | string;
  latestWeeklyApy: number | string;
  virtualPrice: number;
};

export type GetPoolApyDataResponse = {
  success: boolean;
  data: {
    poolList: PoolApyData[];
    totalVolume: number;
    cryptoVolume: number;
    cryptoShare: number;
    generatedTimeMs: number;
  };
};

@Injectable()
export class CurveVolumeDataLoader {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  getLoader({ network }: { network: Network }) {
    const dataLoaderOptions = { cache: true, maxBatchSize: 1000 };
    return new DataLoader<string, number>(async (addresses: string[]) => {
      const apyData = await axios
        .get<GetPoolApyDataResponse>(`https://api.curve.fi/api/getSubgraphData/${TO_CURVE_NETWORK[network]}`)
        .then(res =>
          res.data.data.poolList.map(v => ({
            swapAddress: v.address.toLowerCase(),
            apy: Number(v.latestDailyApy),
            volume: v.volumeUSD,
          })),
        );

      return addresses.map(address => apyData.find(v => v.swapAddress === address)?.volume ?? 0);
    }, dataLoaderOptions);
  }
}
