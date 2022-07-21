import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { STARGATE_FINANCE_DEFINITION } from '../stargate-finance.definition';

import { StargateFinanceFarmHelper } from '../helpers'

const appId = STARGATE_FINANCE_DEFINITION.id;
const groupId = STARGATE_FINANCE_DEFINITION.groups.farm.id;
const network = Network.ETHEREUM_MAINNET;

const address = '0xB0D502E938ed5f4df2E681fE6E419ff29631d62b'

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumStargateFinanceFarmContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(StargateFinanceFarmHelper)
    private readonly helper: StargateFinanceFarmHelper,
  ) { }

  async getPositions() {
    return await this.helper.getPositions({ network, address })
  }
}
