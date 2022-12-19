import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { MuxLevTradesContractPositionHelper } from '../helpers/mux.lev-trades.contract-position-helper';
import { MUX_DEFINITION } from '../mux.definition';

const appId = MUX_DEFINITION.id;
const groupId = MUX_DEFINITION.groups.levTrades.id;
const network = Network.ARBITRUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class ArbitrumMuxLevTradesContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(MuxLevTradesContractPositionHelper)
    private readonly muxLevTradesContractPositionHelper: MuxLevTradesContractPositionHelper,
  ) {}

  async getPositions() {
    return this.muxLevTradesContractPositionHelper.getPosition({ network });
  }
}
