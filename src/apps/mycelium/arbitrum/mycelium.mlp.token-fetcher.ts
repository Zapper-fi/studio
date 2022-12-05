import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { MyceliumMlpTokenHelper } from '../helpers/mycelium.mlp.token-helper';
import { MYCELIUM_DEFINITION } from '../mycelium.definition';

const appId = MYCELIUM_DEFINITION.id;
const groupId = MYCELIUM_DEFINITION.groups.mlp.id;
const network = Network.ARBITRUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class ArbitrumMyceliumMlpTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(@Inject(MyceliumMlpTokenHelper) private readonly myceliumMlpTokenHelper: MyceliumMlpTokenHelper) {}

  async getPositions() {
    return this.myceliumMlpTokenHelper.getTokens({
      network,
      blockedTokenAddresses: [''],
    });
  }
}
