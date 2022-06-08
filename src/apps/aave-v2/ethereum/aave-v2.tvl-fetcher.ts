import { Inject } from '@nestjs/common';
import { sumBy } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { TvlFetcher } from '~stats/tvl/tvl-fetcher.interface';
import { Network } from '~types/network.interface';

import { AAVE_V2_DEFINITION } from '../aave-v2.definition';

@Register.TvlFetcher({ appId: AAVE_V2_DEFINITION.id, network: Network.ETHEREUM_MAINNET })
export class EthereumAaveV2TvlFetcher implements TvlFetcher {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getTvl() {
    const aaveV2SupplyTokens = await this.appToolkit.getAppTokenPositions({
      appId: AAVE_V2_DEFINITION.id,
      groupIds: [AAVE_V2_DEFINITION.groups.supply.id],
      network: Network.ETHEREUM_MAINNET,
    });

    return sumBy(aaveV2SupplyTokens, v => v.supply * v.price);
  }
}
