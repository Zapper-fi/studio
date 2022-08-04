import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { StakedTokenHelper } from '~app-toolkit/helpers/balance/staked.token-helper';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { GAMMA_STRATEGIES_DEFINITION } from '../gamma-strategies.definition';

const appId = GAMMA_STRATEGIES_DEFINITION.id;
const groupId = GAMMA_STRATEGIES_DEFINITION.groups.xGamma.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumGammaStrategiesXGammaTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(@Inject(StakedTokenHelper) private readonly stakedTokenHelper: StakedTokenHelper) {}

  async getPositions() {
    return this.stakedTokenHelper.getTokens({
      address: '0x26805021988f1a45dc708b5fb75fc75f21747d8c',
      underlyingTokenAddress: '0x6bea7cfef803d1e3d5f7c0103f7ded065644e197',
      appId,
      groupId,
      network,
    });
  }
}
