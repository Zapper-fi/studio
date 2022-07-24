import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { StargatePoolTokenHelper } from '../helpers/stargate.pool.token-helper';
import { STARGATE_DEFINITION } from '../stargate.definition';

const appId = STARGATE_DEFINITION.id;
const groupId = STARGATE_DEFINITION.groups.pool.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumStargatePoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(@Inject(StargatePoolTokenHelper) private readonly stargatePoolTokenHelper: StargatePoolTokenHelper) {}

  async getPositions() {
    return this.stargatePoolTokenHelper.getPositions({
      factoryAddress: '0x06d538690af257da524f25d0cd52fd85b1c2173e',
      network,
    });
  }
}
