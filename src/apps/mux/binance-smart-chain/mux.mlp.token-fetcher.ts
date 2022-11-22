import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { MuxMlpTokenHelper } from '~apps/mux/helpers/mux.mlp.token-helper';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { MUX_DEFINITION } from '../mux.definition';

const appId = MUX_DEFINITION.id;
const groupId = MUX_DEFINITION.groups.mlp.id;
const network = Network.BINANCE_SMART_CHAIN_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class BinanceSmartChainMuxMlpTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(@Inject(MuxMlpTokenHelper) private readonly muxMlpTokenHelper: MuxMlpTokenHelper) {}

  async getPositions() {
    return this.muxMlpTokenHelper.getTokens({
      network,
      mlpTokenAddress: '0x07145ad7c7351c6fe86b6b841fc9bed74eb475a7',
    });
  }
}
