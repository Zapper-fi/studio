import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { StargateFinanceFarmHelper } from '../helpers';
import { STARGATE_FINANCE_DEFINITION } from '../stargate-finance.definition';

const appId = STARGATE_FINANCE_DEFINITION.id;
const groupId = STARGATE_FINANCE_DEFINITION.groups.farm.id;
const network = Network.OPTIMISM_MAINNET;

const address = '0x4a364f8c717cAAD9A442737Eb7b8A55cc6cf18D8';

@Register.ContractPositionFetcher({ appId, groupId, network })
export class OptimismStargateFinanceFarmContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(StargateFinanceFarmHelper)
    private readonly helper: StargateFinanceFarmHelper,
  ) {}

  async getPositions() {
    return await this.helper.getPositions({ network, address });
  }
}
