import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { StargateFinancePoolTokenHelper } from '../helpers';
import { STARGATE_FINANCE_DEFINITION } from '../stargate-finance.definition';

const appId = STARGATE_FINANCE_DEFINITION.id;
const groupId = STARGATE_FINANCE_DEFINITION.groups.pool.id;
const network = Network.ARBITRUM_MAINNET;

const addresses = [
  '0x892785f33CdeE22A30AEF750F285E18c18040c3e',
  '0xB6CfcF89a7B22988bfC96632aC2A9D6daB60d641',
  '0x915A55e36A01285A14f05dE6e81ED9cE89772f8e',
];

@Register.TokenPositionFetcher({ appId, groupId, network })
export class ArbitrumStargateFinancePoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(StargateFinancePoolTokenHelper)
    private readonly helper: StargateFinancePoolTokenHelper,
  ) {}

  async getPositions() {
    return await this.helper.getPositions({ network, addresses });
  }
}
