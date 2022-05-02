import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { APP_TOOLKIT, IAppToolkit } from '~lib';
import { TvlFetcher } from '~stats/tvl/tvl-fetcher.interface';
import { Network } from '~types/network.interface';

import THALES_DEFINITION from '../thales.definition';

const appId = THALES_DEFINITION.id;
const network = Network.OPTIMISM_MAINNET;

@Register.TvlFetcher({ appId, network })
export class OptimismThalesTvlFetcher implements TvlFetcher {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getTvl() {
    return 400;
  }
}
