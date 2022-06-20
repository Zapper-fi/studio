import { Inject } from '@nestjs/common';
import { sumBy } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { TvlFetcher } from '~stats/tvl/tvl-fetcher.interface';
import { Network } from '~types/network.interface';

import { AGAVE_DEFINITION } from '../agave.definition';

const appId = AGAVE_DEFINITION.id;
const network = Network.GNOSIS_MAINNET;

@Register.TvlFetcher({ appId, network })
export class GnosisAgaveTvlFetcher implements TvlFetcher {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getTvl() {
    const agaveDepositTokens = await this.appToolkit.getAppTokenPositions({
      appId: AGAVE_DEFINITION.id,
      groupIds: [AGAVE_DEFINITION.groups.deposit.id],
      network: Network.GNOSIS_MAINNET,
    });
    return sumBy(agaveDepositTokens, v => v.supply * v.price);
  }
}
