import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { GravitaVesselContractPositionFetcher } from '../common/gravita.vessel.contract-position-fetcher';

@PositionTemplate()
export class EthereumGravitaVesselContractPositionFetcher extends GravitaVesselContractPositionFetcher {
  borrowerOperationsAddress = '0x2bca0300c2aa65de6f19c2d241b54a445c9990e2';
}
