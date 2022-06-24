import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { TvlFetcher } from '~stats/tvl/tvl-fetcher.interface';
import { Network } from '~types/network.interface';

import { CRONUS_FINANCE_DEFINITION } from '../cronus-finance.definition';

const appId = CRONUS_FINANCE_DEFINITION.id;
const network = Network.EVMOS_MAINNET;

@Register.TvlFetcher({ appId, network })
export class EvmosCronusFinanceTvlFetcher implements TvlFetcher {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getTvl() {
    const farmings = await this.appToolkit.getAppContractPositions({
      appId: appId,
      groupIds: ['farm'],
      network,
    });
    const appTokens = await this.appToolkit.getAppTokenPositions({
      appId: appId,
      groupIds: ['pool'],
      network,
    });

    let tvl = 0;
    farmings.forEach(farming => {
      if (farming) {
        const stakedToken = appTokens.find(v => v.address === farming.tokens[0].address);

        tvl += Number(farming.dataProps.totalValueLocked) * (stakedToken?.price || 0);
      }
    });

    return tvl;
  }
}
