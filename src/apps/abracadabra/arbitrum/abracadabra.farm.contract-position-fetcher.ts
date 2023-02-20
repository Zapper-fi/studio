import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { AbracadabraFarmContractPositionFetcher } from '../common/abracadabra.farm.contract-position-fetcher';

import { CURVE_MIM_3POOL_FARM } from './abracadabra.arbitrum.constants';

@PositionTemplate()
export class ArbitrumAbracadabraFarmContractPositionFetcher extends AbracadabraFarmContractPositionFetcher {
  groupLabel = 'Farms';
  chefAddress = CURVE_MIM_3POOL_FARM;
}
