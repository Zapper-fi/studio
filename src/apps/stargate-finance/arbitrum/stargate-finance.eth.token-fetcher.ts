import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { STARGATE_FINANCE_DEFINITION } from '../stargate-finance.definition';

import { StargateFinanceEthTokenHelper } from '../helpers'

const appId = STARGATE_FINANCE_DEFINITION.id;
const groupId = STARGATE_FINANCE_DEFINITION.groups.eth.id;
const network = Network.ARBITRUM_MAINNET;

const address = '0x915A55e36A01285A14f05dE6e81ED9cE89772f8e'.toLowerCase()

@Register.TokenPositionFetcher({ appId, groupId, network })
export class ArbitrumStargateFinanceEthTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(StargateFinanceEthTokenHelper)
    private readonly helper: StargateFinanceEthTokenHelper,
  ) { }

  async getPositions() {
    return await this.helper.getPositions({ network, address })
  }
}
