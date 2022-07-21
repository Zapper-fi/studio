import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { STARGATE_FINANCE_DEFINITION } from '../stargate-finance.definition';

import { StargateFinancePoolTokenHelper } from '../helpers'

const appId = STARGATE_FINANCE_DEFINITION.id;
const groupId = STARGATE_FINANCE_DEFINITION.groups.pool.id;
const network = Network.OPTIMISM_MAINNET;

const addresses = [
  '0xDecC0c09c3B5f6e92EF4184125D5648a66E35298',
  '0xd22363e3762cA7339569F3d33EADe20127D5F98C',
]

@Register.TokenPositionFetcher({ appId, groupId, network })
export class OptimismStargateFinancePoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(StargateFinancePoolTokenHelper)
    private readonly helper: StargateFinancePoolTokenHelper,
  ) { }

  async getPositions() {
    return await this.helper.getPositions({ network, addresses })
  }
}
