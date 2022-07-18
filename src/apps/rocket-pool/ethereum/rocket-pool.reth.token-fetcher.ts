import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { RocketPoolRethTokenHelper } from '../helpers/rocket-pool.reth.token-helper';
import { ROCKET_POOL_DEFINITION } from '../rocket-pool.definition';

const appId = ROCKET_POOL_DEFINITION.id;
const groupId = ROCKET_POOL_DEFINITION.groups.reth.id;
const network = Network.ETHEREUM_MAINNET;
const address = '0xae78736Cd615f374D3085123A210448E74Fc6393';

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumRocketPoolRethTokenFetcher implements PositionFetcher<AppTokenPosition> {
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
