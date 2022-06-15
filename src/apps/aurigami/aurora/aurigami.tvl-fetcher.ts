import { Inject } from '@nestjs/common';
import { sumBy } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { CompoundSupplyTokenDataProps } from '~apps/compound/helper/compound.supply.token-helper';
import { TvlFetcher } from '~stats/tvl/tvl-fetcher.interface';
import { Network } from '~types/network.interface';

import { AURIGAMI_DEFINITION } from '../aurigami.definition';

const appId = AURIGAMI_DEFINITION.id;
const network = Network.AURORA_MAINNET;

@Register.TvlFetcher({ appId, network })
export class AuroraAurigamiTvlFetcher implements TvlFetcher {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getTvl() {
    const markets = await this.appToolkit.getAppTokenPositions<CompoundSupplyTokenDataProps>({
      appId,
      groupIds: [AURIGAMI_DEFINITION.groups.supply.id],
      network,
    });

    return sumBy(markets, b => b.dataProps.liquidity);
  }
}
