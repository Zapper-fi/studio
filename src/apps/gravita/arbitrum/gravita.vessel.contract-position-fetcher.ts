import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { GravitaVesselContractPositionFetcher } from '../common/gravita.vessel.contract-position-fetcher';

@PositionTemplate()
export class ArbitrumGravitaVesselContractPositionFetcher extends GravitaVesselContractPositionFetcher {
  borrowerOperationsAddress = '0x89f1eccf2644902344db02788a790551bb070351';
}
