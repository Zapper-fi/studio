import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { AbracadabraCauldronContractPositionFetcher } from '../common/abracadabra.cauldron.contract-position-fetcher';

import { OPTIMISM_CAULDRONS } from './abracadabra.optimism.constants';

@PositionTemplate()
export class OptimismAbracadabraCauldronContractPositionFetcher extends AbracadabraCauldronContractPositionFetcher {
  groupLabel = 'Cauldrons';
  cauldrons = OPTIMISM_CAULDRONS;
}
