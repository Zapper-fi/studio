import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { AbracadabraCauldronContractPositionFetcher } from '../common/abracadabra.cauldron.contract-position-fetcher';

@PositionTemplate()
export class ArbitrumAbracadabraCauldronContractPositionFetcher extends AbracadabraCauldronContractPositionFetcher {
  groupLabel = 'Cauldrons';
  cauldrons = [
    '0xc89958b03a55b5de2221acb25b58b89a000215e6', // ETH
    '0x5698135ca439f21a57bddbe8b582c62f090406d5', // GLP
  ];
}
