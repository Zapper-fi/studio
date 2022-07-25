import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { StargatePoolTokenHelper } from '../helpers/stargate.pool.token-helper';
import { STARGATE_DEFINITION } from '../stargate.definition';

const appId = STARGATE_DEFINITION.id;
const groupId = STARGATE_DEFINITION.groups.pool.id;
const network = Network.ARBITRUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class ArbitrumStargatePoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(@Inject(StargatePoolTokenHelper) private readonly stargatePoolTokenHelper: StargatePoolTokenHelper) {}

  async getPositions() {
    return this.stargatePoolTokenHelper.getPositions({
      factoryAddress: '0x55bdb4164d28fbaf0898e0ef14a589ac09ac9970',
      network,
    });
  }
}
