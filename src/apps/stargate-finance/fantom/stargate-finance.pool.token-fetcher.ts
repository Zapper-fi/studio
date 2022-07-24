import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { StargateFinancePoolTokenHelper } from '../helpers';
import { STARGATE_FINANCE_DEFINITION } from '../stargate-finance.definition';

const appId = STARGATE_FINANCE_DEFINITION.id;
const groupId = STARGATE_FINANCE_DEFINITION.groups.pool.id;
const network = Network.FANTOM_OPERA_MAINNET;

const addresses = ['0x12edeA9cd262006cC3C4E77c90d2CD2DD4b1eb97'];

@Register.TokenPositionFetcher({ appId, groupId, network })
export class FantomStargateFinancePoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(StargateFinancePoolTokenHelper)
    private readonly helper: StargateFinancePoolTokenHelper,
  ) {}

  async getPositions() {
    return await this.helper.getPositions({ network, addresses });
  }
}
