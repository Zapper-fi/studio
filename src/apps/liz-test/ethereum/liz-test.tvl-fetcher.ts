import { Inject } from '@nestjs/common';
import { sumBy } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { TvlFetcher } from '~stats/tvl/tvl-fetcher.interface';
import { Network } from '~types/network.interface';

import { LIZ_TEST_DEFINITION } from '../liz-test.definition';

import { PickleJarTokenDataProps } from './liz-test.jar.token-fetcher';

const appId = LIZ_TEST_DEFINITION.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TvlFetcher({ appId, network })
export class EthereumLizTestTvlFetcher implements TvlFetcher {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getTvl() {
    const tokens = await this.appToolkit.getAppTokenPositions<PickleJarTokenDataProps>({
      appId,
      groupIds: [LIZ_TEST_DEFINITION.groups.jar.id],
      network,
    });

    return sumBy(tokens, v => v.dataProps.tvl);
  }
}
