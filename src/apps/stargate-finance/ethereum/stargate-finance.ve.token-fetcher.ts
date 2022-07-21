import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { STARGATE_FINANCE_DEFINITION } from '../stargate-finance.definition';

import { StargateFinanceVeTokenHelper } from '../helpers'

const appId = STARGATE_FINANCE_DEFINITION.id;
const groupId = STARGATE_FINANCE_DEFINITION.groups.ve.id;
const network = Network.ETHEREUM_MAINNET;

const address = '0x0e42acBD23FAee03249DAFF896b78d7e79fBD58E'.toLowerCase()

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumStargateFinanceVeTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(StargateFinanceVeTokenHelper)
    private readonly helper: StargateFinanceVeTokenHelper,
  ) { }

  async getPositions() {
    return await this.helper.getPositions({ network, address })
  }
}
