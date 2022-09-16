import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { AbracadabraMspellContractPositionFetcher } from '../common/abracadabra.m-spell.contract-position-fetcher';

@PositionTemplate()
export class ArbitrumAbracadabraMspellContractPositionFetcher extends AbracadabraMspellContractPositionFetcher {
  groupLabel = 'mSPELL';
  mSpellAddress = '0x1df188958a8674b5177f77667b8d173c3cdd9e51';
}
