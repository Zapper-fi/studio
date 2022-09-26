import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { MetavaultTradeOptionContractPositionHelper } from '../helpers/metavault-trade.option.contract-position-helper';
import { METAVAULT_TRADE_DEFINITION } from '../metavault-trade.definition';

const appId = METAVAULT_TRADE_DEFINITION.id;
const groupId = METAVAULT_TRADE_DEFINITION.groups.option.id;
const network = Network.POLYGON_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class PolygonOptionsFarmContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(MetavaultTradeOptionContractPositionHelper)
    private readonly metavaultTradeOptionContractPositionHelper: MetavaultTradeOptionContractPositionHelper,
  ) {}

  async getPositions() {
    const vaultAddress = '0x32848e2d3aecfa7364595609fb050a301050a6b4';
    return this.metavaultTradeOptionContractPositionHelper.getPosition({ network, vaultAddress });
  }
}
