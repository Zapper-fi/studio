import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { STARGATE_FINANCE_DEFINITION } from '../stargate-finance.definition';

import { StargateFinanceEthTokenHelper } from '../helpers'

const appId = STARGATE_FINANCE_DEFINITION.id;
const groupId = STARGATE_FINANCE_DEFINITION.groups.eth.id;
const network = Network.ETHEREUM_MAINNET;

const address = '0x72E2F4830b9E45d52F80aC08CB2bEC0FeF72eD9c'.toLowerCase()

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumStargateFinanceEthTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(StargateFinanceEthTokenHelper)
    private readonly helper: StargateFinanceEthTokenHelper,
  ) { }

  async getPositions() {
    return await this.helper.getPositions({ network, address })
  }
}
