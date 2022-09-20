import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { MyceliumLevTradesContractPositionHelper } from '../helpers/mycelium.lev-trades.contract-position-helper';
import { MYCELIUM_DEFINITION } from '../mycelium.definition';

const appId = MYCELIUM_DEFINITION.id;
const groupId = MYCELIUM_DEFINITION.groups.levTrades.id;
const network = Network.ARBITRUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class ArbitrumMyceliumLevTradesContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(MyceliumLevTradesContractPositionHelper)
    private readonly myceliumLevTradesContractPositionHelper: MyceliumLevTradesContractPositionHelper,
  ) {}

  async getPositions() {
    return this.myceliumLevTradesContractPositionHelper.getPosition({ network });
  }
}
