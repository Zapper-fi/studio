import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { MetavaultTradeEsMvxTokenHelper } from '../helpers/metavault-trade.es-mvx.token-helper';
import { METAVAULT_TRADE_DEFINITION } from '../metavault-trade.definition';

const appId = METAVAULT_TRADE_DEFINITION.id;
const groupId = METAVAULT_TRADE_DEFINITION.groups.esMvx.id;
const network = Network.POLYGON_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network, options: { excludeFromTvl: true } })
export class PolygonMetavaultTradeEsMvxTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(MetavaultTradeEsMvxTokenHelper)
    private readonly metavaultTradeEsMvxTokenHelper: MetavaultTradeEsMvxTokenHelper,
  ) {}

  async getPositions() {
    return this.metavaultTradeEsMvxTokenHelper.getTokens({
      esMvxTokenAddress: '0xd1b2f8dff8437be57430ee98767d512f252ead61',
      network,
    });
  }
}
