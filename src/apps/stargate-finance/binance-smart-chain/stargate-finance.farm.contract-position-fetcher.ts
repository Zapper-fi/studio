import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { StargateFinanceFarmHelper } from '../helpers';
import { STARGATE_FINANCE_DEFINITION } from '../stargate-finance.definition';

const appId = STARGATE_FINANCE_DEFINITION.id;
const groupId = STARGATE_FINANCE_DEFINITION.groups.farm.id;
const network = Network.BINANCE_SMART_CHAIN_MAINNET;

const address = '0x3052A0F6ab15b4AE1df39962d5DdEFacA86DaB47';

@Register.ContractPositionFetcher({ appId, groupId, network })
export class BinanceSmartChainStargateFinanceFarmContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(StargateFinanceFarmHelper)
    private readonly helper: StargateFinanceFarmHelper,
  ) {}

  async getPositions() {
    return await this.helper.getPositions({ network, address });
  }
}
