import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { MuxLevTradesContractPositionHelper } from '~apps/mux/helpers/mux.lev-trades.contract-position-helper';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { MUX_DEFINITION } from '../mux.definition';

const appId = MUX_DEFINITION.id;
const groupId = MUX_DEFINITION.groups.levTrades.id;
const network = Network.FANTOM_OPERA_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class FantomMuxLevTradesContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(MuxLevTradesContractPositionHelper)
    private readonly muxLevTradesContractPositionHelper: MuxLevTradesContractPositionHelper,
  ) {}

  async getPositions() {
    return this.muxLevTradesContractPositionHelper.getPosition({ network });
  }
}
