import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { MyceliumEsMycTokenHelper } from '../helpers/mycelium.es-myc.token-helper';
import { MYCELIUM_DEFINITION } from '../mycelium.definition';

const appId = MYCELIUM_DEFINITION.id;
const groupId = MYCELIUM_DEFINITION.groups.esMyc.id;
const network = Network.ARBITRUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class ArbitrumMyceliumEsMycTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(@Inject(MyceliumEsMycTokenHelper) private readonly myceliumEsMycTokenHelper: MyceliumEsMycTokenHelper) {}

  async getPositions() {
    return this.myceliumEsMycTokenHelper.getTokens({
      network,
    });
  }
}
