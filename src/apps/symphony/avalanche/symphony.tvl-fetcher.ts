import { Inject } from '@nestjs/common';
import { sumBy } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { TvlFetcher } from '~stats/tvl/tvl-fetcher.interface';
import { Network } from '~types/network.interface';

import { SymphonyYoloTokenDataProps } from '../helpers/types';
import { SYMPHONY_DEFINITION } from '../symphony.definition';

const appId = SYMPHONY_DEFINITION.id;
const network = Network.AVALANCHE_MAINNET;

@Register.TvlFetcher({ appId, network })
export class AvalancheSymphonyTvlFetcher implements TvlFetcher {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getTvl() {
    const tokens = await this.appToolkit.getAppContractPositions<SymphonyYoloTokenDataProps>({
      appId,
      groupIds: [SYMPHONY_DEFINITION.groups.yolo.id],
      network,
    });

    return sumBy(tokens, v => v.dataProps.totalValueLocked);
  }
}
