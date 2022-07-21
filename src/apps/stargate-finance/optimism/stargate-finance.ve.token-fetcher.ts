import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { STARGATE_FINANCE_DEFINITION } from '../stargate-finance.definition';

import { StargateFinanceVeTokenHelper } from '../helpers'

const appId = STARGATE_FINANCE_DEFINITION.id;
const groupId = STARGATE_FINANCE_DEFINITION.groups.ve.id;
const network = Network.OPTIMISM_MAINNET;

const address = '0x43d2761ed16C89A2C4342e2B16A3C61Ccf88f05B'.toLowerCase()

@Register.TokenPositionFetcher({ appId, groupId, network })
export class OptimismStargateFinanceVeTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(StargateFinanceVeTokenHelper)
    private readonly helper: StargateFinanceVeTokenHelper,
  ) { }

  async getPositions() {
    return await this.helper.getPositions({ network, address })
  }
}
