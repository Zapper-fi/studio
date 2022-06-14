import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { TempusTokensTokenFetcher } from '../helpers/tempus.pool.token-helper';
import { TEMPUS_DEFINITION } from '../tempus.definition';

const appId = TEMPUS_DEFINITION.id;
const groupId = TEMPUS_DEFINITION.groups.pool.id;
const network = Network.FANTOM_OPERA_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class FantomTempusTokensTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(@Inject(TempusTokensTokenFetcher) private readonly tempusTokensTokenFetcher: TempusTokensTokenFetcher) {}

  async getPositions() {
    return this.tempusTokensTokenFetcher.getPositions(network);
  }
}
