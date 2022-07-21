import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { STARGATE_FINANCE_DEFINITION } from '../stargate-finance.definition';

import { StargateFinancePoolTokenHelper } from '../helpers'

const appId = STARGATE_FINANCE_DEFINITION.id;
const groupId = STARGATE_FINANCE_DEFINITION.groups.pool.id;
const network = Network.ETHEREUM_MAINNET;

const addresses = [
  '0xdf0770dF86a8034b3EFEf0A1Bb3c889B8332FF56',
  '0x38EA452219524Bb87e18dE1C24D3bB59510BD783',
  '0x101816545F6bd2b1076434B54383a1E633390A2E',
]

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumStargateFinancePoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(StargateFinancePoolTokenHelper)
    private readonly helper: StargateFinancePoolTokenHelper,
  ) { }

  async getPositions() {
    return await this.helper.getPositions({ network, addresses })
  }
}
