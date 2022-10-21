import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { MuxMlpTokenHelper } from '../helpers/mux.mlp.token-helper';
import { MUX_DEFINITION } from '../mux.definition';

const appId = MUX_DEFINITION.id;
const groupId = MUX_DEFINITION.groups.mlp.id;
const network = Network.AVALANCHE_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class AvalancheMuxMlpTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(@Inject(MuxMlpTokenHelper) private readonly muxMlpTokenHelper: MuxMlpTokenHelper) {}

  async getPositions() {
    return this.muxMlpTokenHelper.getTokens({
      network,
      mlpTokenAddress: '0xaf2d365e668baafedcfd256c0fbbe519e594e390',
    });
  }
}
