import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { KyberSwapClassicFarmContractPositionFetcher } from '../common/kyberswap-classic.farm.contract-position-fetcher';

@PositionTemplate()
export class EthereumKyberSwapClassicFarmContractPositionFetcher extends KyberSwapClassicFarmContractPositionFetcher {
  groupLabel = 'Farms';
  chefAddress = '0x31de05f28568e3d3d612bfa6a78b356676367470';
}
