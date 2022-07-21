import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { StargateFinanceVeTokenHelper } from '../helpers';
import { STARGATE_FINANCE_DEFINITION } from '../stargate-finance.definition';

const appId = STARGATE_FINANCE_DEFINITION.id;
const groupId = STARGATE_FINANCE_DEFINITION.groups.ve.id;
const network = Network.ARBITRUM_MAINNET;

const address = '0xfBd849E6007f9BC3CC2D6Eb159c045B8dc660268'.toLowerCase();

@Register.TokenPositionFetcher({ appId, groupId, network })
export class ArbitrumStargateFinanceVeTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(StargateFinanceVeTokenHelper)
    private readonly helper: StargateFinanceVeTokenHelper,
  ) {}

  async getPositions() {
    return await this.helper.getPositions({ network, address });
  }
}
