import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionBalanceFetcher } from '~position/position-balance-fetcher.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { Network } from '~types/network.interface';

import { SynthetixMintrContractPositionBalanceHelper } from '../helpers/synthetix.mintr.contract-position-balance-helper';
import { SYNTHETIX_DEFINITION } from '../synthetix.definition';

const appId = SYNTHETIX_DEFINITION.id;
const groupId = SYNTHETIX_DEFINITION.groups.mintr.id;
const network = Network.OPTIMISM_MAINNET;

@Register.ContractPositionBalanceFetcher({ appId, groupId, network })
export class OptimismSynthetixMintrContractPositionBalanceFetcher
  implements PositionBalanceFetcher<ContractPositionBalance>
{
  constructor(
    @Inject(SynthetixMintrContractPositionBalanceHelper)
    private readonly synthetixMintrContractPositionBalanceHelper: SynthetixMintrContractPositionBalanceHelper,
  ) {}

  async getBalances(address: string) {
    return this.synthetixMintrContractPositionBalanceHelper.getBalances({ address, network: Network.OPTIMISM_MAINNET });
  }
}
