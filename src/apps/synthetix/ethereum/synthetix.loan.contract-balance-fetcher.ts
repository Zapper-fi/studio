import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { Network } from '~types/network.interface';
import { SynthetixLoanContractBalanceHelper } from '../helpers/synthetix.loan.contract-balance-helper';

import { PositionBalanceFetcher } from '~position/position-balance-fetcher.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';

import { SYNTHETIX_DEFINITION } from '../synthetix.definition';

const appId = SYNTHETIX_DEFINITION.id;
const groupId = SYNTHETIX_DEFINITION.groups.loan.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionBalanceFetcher({ appId, groupId, network })
export class EthereumSynthetixLoanContractBalanceFetcher
  implements PositionBalanceFetcher<ContractPositionBalance>
{
  constructor(@Inject(SynthetixLoanContractBalanceHelper)
  private readonly synthetixLoanContractBalanceHelper: SynthetixLoanContractBalanceHelper) { }

  async getBalances(address: string) {
    const endpoint = 'https://api.thegraph.com/subgraphs/name/synthetixio-team/mainnet-main';
    return this.synthetixLoanContractBalanceHelper.getBalances({ address, network, endpoint });
  }
}
