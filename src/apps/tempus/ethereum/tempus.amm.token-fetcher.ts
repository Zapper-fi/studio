import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { TempusAmmTokenFetcher } from '../helpers/tempus.amm.token-helper';
import { TEMPUS_DEFINITION } from '../tempus.definition';

const appId = TEMPUS_DEFINITION.id;
const groupId = TEMPUS_DEFINITION.groups.amm.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumTempusAmmTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(TempusAmmTokenFetcher)
    private readonly tempusAmmTokenFetcher: TempusAmmTokenFetcher,
  ) {}

  async getPositions() {
    return this.tempusAmmTokenFetcher.getPositions(network);
  }
}
