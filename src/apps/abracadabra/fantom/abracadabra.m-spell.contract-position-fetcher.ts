import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { AbracadabraMspellContractPositionFetcher } from '../common/abracadabra.m-spell.contract-position-fetcher';

@PositionTemplate()
export class FantomAbracadabraMspellContractPositionFetcher extends AbracadabraMspellContractPositionFetcher {
  groupLabel = 'mSPELL';
  mSpellAddress = '0xa668762fb20bcd7148db1bdb402ec06eb6dad569';
}
