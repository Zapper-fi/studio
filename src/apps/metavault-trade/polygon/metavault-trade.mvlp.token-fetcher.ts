import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { MvxMvlpTokenHelper } from '../helpers/mvx.mvlp.token-helper';
import { METAVAULT_TRADE_DEFINITION } from '../metavault-trade.definition';

const appId = METAVAULT_TRADE_DEFINITION.id;
const groupId = METAVAULT_TRADE_DEFINITION.groups.mvlp.id;
const network = Network.POLYGON_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class PolygonMetavaultTradeMvlpTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(@Inject(MvxMvlpTokenHelper) private readonly mvxMvlpTokenHelper: MvxMvlpTokenHelper) {}

  async getPositions() {
    return this.mvxMvlpTokenHelper.getTokens({
      mvlpManagerAddress: '0x13e733ddd6725a8133bec31b2fc5994fa5c26ea9',
      mvlpTokenAddress: '0x9f4f8bc00f48663b7c204c96b932c29ccc43a2e8',
      network,
    });
  }
}
