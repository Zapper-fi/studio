import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import GMX_DEFINITION from '../gmx.definition';
import { GmxGlpTokenHelper } from '../helpers/gmx.glp.token-helper';

const appId = GMX_DEFINITION.id;
const groupId = GMX_DEFINITION.groups.glp.id;
const network = Network.ARBITRUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class ArbitrumGmxGlpTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(@Inject(GmxGlpTokenHelper) private readonly gmxGlpTokenHelper: GmxGlpTokenHelper) {}

  async getPositions() {
    return this.gmxGlpTokenHelper.getTokens({
      glmManagerAddress: '0x321f653eed006ad1c29d174e17d96351bde22649',
      glpTokenAddress: '0x4277f8f2c384827b5273592ff7cebd9f2c1ac258',
      network,
    });
  }
}
