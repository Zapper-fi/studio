import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { STARGATE_FINANCE_DEFINITION } from '../stargate-finance.definition';

import { StargateFinanceFarmHelper } from '../helpers'

const appId = STARGATE_FINANCE_DEFINITION.id;
const groupId = STARGATE_FINANCE_DEFINITION.groups.farm.id;
const network = Network.ARBITRUM_MAINNET;

const address = '0xeA8DfEE1898a7e0a59f7527F076106d7e44c2176'

@Register.ContractPositionFetcher({ appId, groupId, network })
export class ArbitrumStargateFinanceFarmContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(StargateFinanceFarmHelper)
    private readonly helper: StargateFinanceFarmHelper,
  ) { }

  async getPositions() {
    return await this.helper.getPositions({ network, address })
  }
}
