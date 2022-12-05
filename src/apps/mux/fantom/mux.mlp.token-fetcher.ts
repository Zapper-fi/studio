import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { MuxMlpTokenHelper } from '~apps/mux/helpers/mux.mlp.token-helper';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { MUX_DEFINITION } from '../mux.definition';

const appId = MUX_DEFINITION.id;
const groupId = MUX_DEFINITION.groups.mlp.id;
const network = Network.FANTOM_OPERA_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class FantomMuxMlpTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(@Inject(MuxMlpTokenHelper) private readonly muxMlpTokenHelper: MuxMlpTokenHelper) {}

  async getPositions() {
    return this.muxMlpTokenHelper.getTokens({
      network,
      mlpTokenAddress: '0xddade9a8da4851960dfcff1ae4a18ee75c39edd2',
    });
  }
}
