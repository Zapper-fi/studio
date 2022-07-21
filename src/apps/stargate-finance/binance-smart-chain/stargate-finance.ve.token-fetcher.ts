import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { STARGATE_FINANCE_DEFINITION } from '../stargate-finance.definition';

import { StargateFinanceVeTokenHelper } from '../helpers'

const appId = STARGATE_FINANCE_DEFINITION.id;
const groupId = STARGATE_FINANCE_DEFINITION.groups.ve.id;
const network = Network.BINANCE_SMART_CHAIN_MAINNET;

const address = '0xD4888870C8686c748232719051b677791dBDa26D'.toLowerCase()

@Register.TokenPositionFetcher({ appId, groupId, network })
export class BinanceSmartChainStargateFinanceVeTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(StargateFinanceVeTokenHelper)
    private readonly helper: StargateFinanceVeTokenHelper,
  ) { }

  async getPositions() {
    return await this.helper.getPositions({ network, address })
  }
}
