import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { AbracadabraCauldronContractPositionFetcher } from '../common/abracadabra.cauldron.contract-position-fetcher';

@PositionTemplate()
export class ArbitrumAbracadabraCauldronContractPositionFetcher extends AbracadabraCauldronContractPositionFetcher {
  groupLabel = 'Cauldrons';
  cauldrons = [
    '0xc89958b03a55b5de2221acb25b58b89a000215e6', // ETH
  ];
}
