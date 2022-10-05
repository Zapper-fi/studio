import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { NaosFarmContractPositionFetcher } from '../common/naos.farm.contract-position-fetcher';

@PositionTemplate()
export class EthereumNaosFarmContractPositionFetcher extends NaosFarmContractPositionFetcher {
  groupLabel = 'Staking';
  chefAddresses = ['0x99e4ea9ef6bf396c49b35ff9478ebb8890aef581'];
}
