import { Inject } from '@nestjs/common';
import { sumBy } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { TvlFetcher } from '~stats/tvl/tvl-fetcher.interface';
import { Network } from '~types/network.interface';

import UNISWAP_V2_DEFINITION from '../uniswap-v2.definition';

const appId = UNISWAP_V2_DEFINITION.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TvlFetcher({ appId, network })
export class EthereumUniswapV2TvlFetcher implements TvlFetcher {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getTvl() {
    const positions = await this.appToolkit.getAppTokenPositions({
      appId,
      groupIds: ['pool'],
      network,
    });

    return sumBy(positions, v => v.dataProps.liquidity as number);
  }
}
