import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { STARGATE_FINANCE_DEFINITION } from '../stargate-finance.definition';

import { StargateFinancePoolTokenHelper } from '../helpers'

const appId = STARGATE_FINANCE_DEFINITION.id;
const groupId = STARGATE_FINANCE_DEFINITION.groups.pool.id;
const network = Network.BINANCE_SMART_CHAIN_MAINNET;

const addresses = [
  '0x9aA83081AA06AF7208Dcc7A4cB72C94d057D2cda',
  '0x98a5737749490856b401DB5Dc27F522fC314A4e1',
]

@Register.TokenPositionFetcher({ appId, groupId, network })
export class BinanceSmartChainStargateFinancePoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(StargateFinancePoolTokenHelper)
    private readonly helper: StargateFinancePoolTokenHelper,
  ) { }

  async getPositions() {
    return await this.helper.getPositions({ network, addresses })
  }
}
