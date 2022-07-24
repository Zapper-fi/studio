import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { StargateFinanceFarmHelper } from '../helpers';
import { STARGATE_FINANCE_DEFINITION } from '../stargate-finance.definition';

const appId = STARGATE_FINANCE_DEFINITION.id;
const groupId = STARGATE_FINANCE_DEFINITION.groups.farm.id;
const network = Network.AVALANCHE_MAINNET;

const address = '0x8731d54E9D02c286767d56ac03e8037C07e01e98';

@Register.ContractPositionFetcher({ appId, groupId, network })
export class AvalancheStargateFinanceFarmContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(StargateFinanceFarmHelper)
    private readonly helper: StargateFinanceFarmHelper,
  ) {}

  async getPositions() {
    return await this.helper.getPositions({ network, address });
  }
}
