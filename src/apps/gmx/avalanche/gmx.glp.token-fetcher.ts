import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import GMX_DEFINITION from '../gmx.definition';
import { GmxGlpTokenHelper } from '../helpers/gmx.glp.token-helper';

const appId = GMX_DEFINITION.id;
const groupId = GMX_DEFINITION.groups.glp.id;
const network = Network.AVALANCHE_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class AvalancheGmxGlpTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(@Inject(GmxGlpTokenHelper) private readonly gmxGlpTokenHelper: GmxGlpTokenHelper) {}

  async getPositions() {
    return this.gmxGlpTokenHelper.getTokens({
      glmManagerAddress: '0xe1ae4d4b06a5fe1fc288f6b4cd72f9f8323b107f',
      glpTokenAddress: '0x01234181085565ed162a948b6a5e88758cd7c7b8',
      network,
    });
  }
}
