import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { SynthetixLoanContractPositionFetcher } from '../common/synthetix.loan.contract-position-fetcher';

@PositionTemplate()
export class OptimismSynthetixLoanContractPositionFetcher extends SynthetixLoanContractPositionFetcher {
  groupLabel = 'Loans';
  loanAddress = '0x308ad16ef90fe7cacb85b784a603cb6e71b1a41a';
  sUSDAddress = '0x8c6f28f2f1a3c87f0f938b96d27520d9751ec8d9';
  sETHAddress = '0xe405de8f52ba7559f9df3c368500b6e6ae6cee49';
  subgraphUrl = 'https://api.thegraph.com/subgraphs/name/synthetixio-team/optimism-main';
}
