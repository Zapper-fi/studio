import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { SynthetixMintrContractPositionFetcher } from '../common/synthetix.mintr.contract-position-fetcher';

@PositionTemplate()
export class EthereumSynthetixMintrContractPositionFetcher extends SynthetixMintrContractPositionFetcher {
  groupLabel = 'Mintr';
  isExcludedFromTvl = true;
  snxAddress = '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f';
  sUSDAddress = '0x57ab1ec28d129707052df4df418d58a2d46d5f51';
  feePoolAddress = '0x83105d7cdd2fd9b8185bff1cb56bb1595a618618';
}
