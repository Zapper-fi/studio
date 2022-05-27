import { Inject } from '@nestjs/common';
import { sumBy } from 'lodash';

import { SingleStakingFarmDataProps } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { TvlFetcher } from '~stats/tvl/tvl-fetcher.interface';
import { Network } from '~types/network.interface';

import { TOKEMAK_DEFINITION } from '../tokemak.definition';

@Register.TvlFetcher({ appId: TOKEMAK_DEFINITION.id, network: Network.ETHEREUM_MAINNET })
export class EthereumTokemakTvlFetcher implements TvlFetcher {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getTvl() {
    const farmPositions = await this.appToolkit.getAppContractPositions<SingleStakingFarmDataProps>({
      appId: TOKEMAK_DEFINITION.id,
      groupIds: [TOKEMAK_DEFINITION.groups.farm.id],
      network: Network.ETHEREUM_MAINNET,
    });

    return sumBy(farmPositions, position => position.dataProps.liquidity);
  }
}
