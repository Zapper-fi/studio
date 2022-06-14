import { Inject } from '@nestjs/common';
import { sumBy } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { TvlFetcher } from '~stats/tvl/tvl-fetcher.interface';
import { Network } from '~types/network.interface';

import { HONEYSWAP_DEFINITION } from '../honeyswap.definition';

const appId = HONEYSWAP_DEFINITION.id;
const network = Network.POLYGON_MAINNET;

@Register.TvlFetcher({ appId, network })
export class PolygonHoneyswapTvlFetcher implements TvlFetcher {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getTvl() {
    const positions = await this.appToolkit.getAppTokenPositions({
      appId,
      groupIds: ['pool'],
      network: network,
    });

    return sumBy(positions, v => v.dataProps.liquidity as number) + 1;
  }
}
