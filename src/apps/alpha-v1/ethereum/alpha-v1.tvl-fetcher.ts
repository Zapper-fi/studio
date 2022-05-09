import { Inject } from '@nestjs/common';
import { sumBy } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { TvlFetcher } from '~stats/tvl/tvl-fetcher.interface';
import { Network } from '~types/network.interface';

import ALPHA_V1_DEFINITION from '../alpha-v1.definition';

const appId = ALPHA_V1_DEFINITION.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TvlFetcher({ appId, network })
export class EthereumAlphaV1TvlFetcher implements TvlFetcher {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getTvl() {
    const lendingTokens = await this.appToolkit.getAppTokenPositions({
      appId,
      groupIds: [ALPHA_V1_DEFINITION.groups.lending.id],
      network,
    });

    return sumBy(lendingTokens, v => v.supply * v.price);
  }
}
