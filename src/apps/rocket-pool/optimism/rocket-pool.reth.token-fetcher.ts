import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { RocketPoolRethTokenHelper } from '../helpers/rocket-pool.reth.token-helper';
import { ROCKET_POOL_DEFINITION } from '../rocket-pool.definition';

const appId = ROCKET_POOL_DEFINITION.id;
const groupId = ROCKET_POOL_DEFINITION.groups.reth.id;
const network = Network.OPTIMISM_MAINNET;
const address = '0x9bcef72be871e61ed4fbbc7630889bee758eb81d';

@Register.TokenPositionFetcher({ appId, groupId, network })
export class OptimismRocketPoolRethTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(RocketPoolRethTokenHelper) private readonly rocketPoolRethTokenHelper: RocketPoolRethTokenHelper,
  ) {}

  async getPositions() {
    return this.rocketPoolRethTokenHelper.getPositions({
      appId,
      network,
      address,
    });
  }
}
