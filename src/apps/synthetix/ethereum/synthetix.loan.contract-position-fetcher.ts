import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { SynthetixLoanContractPositionFetcher } from '../common/synthetix.loan.contract-position-fetcher';

@PositionTemplate()
export class EthereumSynthetixLoanContractPositionFetcher extends SynthetixLoanContractPositionFetcher {
  groupLabel = 'Loans';
  loanAddress = '0x5c8344bcdc38f1ab5eb5c1d4a35ddeea522b5dfa';
  sUSDAddress = '0x57ab1ec28d129707052df4df418d58a2d46d5f51';
  sETHAddress = '0x5e74c9036fb86bd7ecdcb084a0673efc32ea31cb';
  subgraphUrl = 'https://api.thegraph.com/subgraphs/name/synthetixio-team/mainnet-main';
}
