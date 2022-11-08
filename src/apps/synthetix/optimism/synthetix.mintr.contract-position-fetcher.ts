import { Register } from '~app-toolkit/decorators';
import { Network } from '~types/network.interface';

import { SynthetixMintrContractPositionFetcher } from '../common/synthetix.mintr.contract-position-fetcher';
import { SYNTHETIX_DEFINITION } from '../synthetix.definition';

const appId = SYNTHETIX_DEFINITION.id;
const groupId = SYNTHETIX_DEFINITION.groups.mintr.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network, options: { excludeFromTvl: true } })
export class OptimismSynthetixMintrContractPositionFetcher extends SynthetixMintrContractPositionFetcher {
  groupLabel = 'Mintr';
  isExcludedFromTvl = true;
  snxAddress = '0x8700daec35af8ff88c16bdf0418774cb3d7599b4';
  sUSDAddress = '0x8c6f28f2f1a3c87f0f938b96d27520d9751ec8d9';
}
