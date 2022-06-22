import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionBalanceFetcher } from '~position/position-balance-fetcher.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { Network } from '~types/network.interface';

import BADGER_DEFINITION from '../badger.definition';
import { BadgerClaimableContractPositionBalanceHelper } from '../helpers/badger.claimable.balance-helper';

const appId = BADGER_DEFINITION.id;
const groupId = BADGER_DEFINITION.groups.claimable.id;
const network = Network.ARBITRUM_MAINNET;

@Register.ContractPositionBalanceFetcher({ appId, groupId, network })
export class ArbitrumBadgerClaimableContractPositionBalanceFetcher
  implements PositionBalanceFetcher<ContractPositionBalance>
{
  constructor(
    @Inject(BadgerClaimableContractPositionBalanceHelper)
    private readonly badgerClaimableBalancesHelper: BadgerClaimableContractPositionBalanceHelper,
  ) {}

  async getBalances(address: string) {
    return this.badgerClaimableBalancesHelper.getBalances({ address, network });
  }
}
