import { Register } from '~app-toolkit/decorators';
import { Network } from '~types/network.interface';

import { SynthetixMintrContractPositionFetcher } from '../common/synthetix.mintr.contract-position-fetcher';
import { SYNTHETIX_DEFINITION } from '../synthetix.definition';

const appId = SYNTHETIX_DEFINITION.id;
const groupId = SYNTHETIX_DEFINITION.groups.mintr.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network, options: { excludeFromTvl: true } })
export class EthereumSynthetixMintrContractPositionFetcher extends SynthetixMintrContractPositionFetcher {
  groupLabel = 'Mintr';
  isExcludedFromTvl = true;
  snxAddress = '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f';
  sUSDAddress = '0x57ab1ec28d129707052df4df418d58a2d46d5f51';
}
