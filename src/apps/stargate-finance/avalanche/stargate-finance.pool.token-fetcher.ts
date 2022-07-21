import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { STARGATE_FINANCE_DEFINITION } from '../stargate-finance.definition';

import { StargateFinancePoolTokenHelper } from '../helpers'

const appId = STARGATE_FINANCE_DEFINITION.id;
const groupId = STARGATE_FINANCE_DEFINITION.groups.pool.id;
const network = Network.AVALANCHE_MAINNET;

const addresses = [
  '0x1205f31718499dBf1fCa446663B532Ef87481fe1',
  '0x29e38769f23701A2e4A8Ef0492e19dA4604Be62c',
]

@Register.TokenPositionFetcher({ appId, groupId, network })
export class AvalancheStargateFinancePoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(StargateFinancePoolTokenHelper)
    private readonly helper: StargateFinancePoolTokenHelper,
  ) { }

  async getPositions() {
    return await this.helper.getPositions({ network, addresses })
  }
}
