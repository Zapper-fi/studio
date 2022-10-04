import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionBalanceFetcher } from '~position/position-balance-fetcher.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { Network } from '~types/network.interface';

import { SynthetixLoanContractBalanceHelper } from '../helpers/synthetix.loan.contract-balance-helper';
import { SYNTHETIX_DEFINITION } from '../synthetix.definition';

const appId = SYNTHETIX_DEFINITION.id;
const groupId = SYNTHETIX_DEFINITION.groups.loan.id;
const network = Network.OPTIMISM_MAINNET;

@Register.ContractPositionBalanceFetcher({ appId, groupId, network })
export class OptimismSynthetixLoanContractBalanceFetcher implements PositionBalanceFetcher<ContractPositionBalance> {
  constructor(
    @Inject(SynthetixLoanContractBalanceHelper)
    private readonly synthetixLoanContractBalanceHelper: SynthetixLoanContractBalanceHelper,
  ) {}

  async getBalances(address: string) {
    const endpoint = 'https://api.thegraph.com/subgraphs/name/synthetixio-team/optimism-main';
    return this.synthetixLoanContractBalanceHelper.getBalances({ address, network, endpoint });
  }
}
