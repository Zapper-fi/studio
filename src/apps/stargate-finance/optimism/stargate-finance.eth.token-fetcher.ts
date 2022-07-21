import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { STARGATE_FINANCE_DEFINITION } from '../stargate-finance.definition';

import { StargateFinanceEthTokenHelper } from '../helpers'

const appId = STARGATE_FINANCE_DEFINITION.id;
const groupId = STARGATE_FINANCE_DEFINITION.groups.eth.id;
const network = Network.OPTIMISM_MAINNET;

const address = '0xd22363e3762cA7339569F3d33EADe20127D5F98C'.toLowerCase()


@Register.TokenPositionFetcher({ appId, groupId, network })
export class OptimismStargateFinanceEthTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(StargateFinanceEthTokenHelper)
    private readonly helper: StargateFinanceEthTokenHelper,
  ) { }

  async getPositions() {
    return await this.helper.getPositions({ network, address })
  }
}
