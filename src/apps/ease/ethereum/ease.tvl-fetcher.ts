import { Inject } from '@nestjs/common';
import { sumBy } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { TvlFetcher } from '~stats/tvl/tvl-fetcher.interface';
import { Network } from '~types/network.interface';

import { EASE_DEFINITION } from '../ease.definition';

const appId = EASE_DEFINITION.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TvlFetcher({ appId, network })
export class EthereumEaseTvlFetcher implements TvlFetcher {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) { }

  async getTvl() {
    const tokens = await this.appToolkit.getAppTokenPositions({
      appId,
      groupIds: [EASE_DEFINITION.groups.rca.id],
      network
    });
    return sumBy(tokens, v => v.supply * v.price);
  }
}
