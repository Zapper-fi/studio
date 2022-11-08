import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { SynthetixMintrContractPositionFetcher } from '../common/synthetix.mintr.contract-position-fetcher';

@PositionTemplate()
export class OptimismSynthetixMintrContractPositionFetcher extends SynthetixMintrContractPositionFetcher {
  groupLabel = 'Mintr';
  isExcludedFromTvl = true;
  snxAddress = '0x8700daec35af8ff88c16bdf0418774cb3d7599b4';
  sUSDAddress = '0x8c6f28f2f1a3c87f0f938b96d27520d9751ec8d9';
}
