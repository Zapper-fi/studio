import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { AbracadabraCauldronContractPositionFetcher } from '../common/abracadabra.cauldron.contract-position-fetcher';

import { ARBITRUM_GLP_CAULDRONS, ARBITRUM_CAULDRONS } from './abracadabra.arbitrum.constants';

@PositionTemplate()
export class ArbitrumAbracadabraCauldronContractPositionFetcher extends AbracadabraCauldronContractPositionFetcher {
  groupLabel = 'Cauldrons';
  cauldrons = ARBITRUM_CAULDRONS;
  glpCauldrons = ARBITRUM_GLP_CAULDRONS;
}
