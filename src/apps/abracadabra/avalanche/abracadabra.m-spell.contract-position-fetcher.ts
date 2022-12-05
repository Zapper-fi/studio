import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { AbracadabraMspellContractPositionFetcher } from '../common/abracadabra.m-spell.contract-position-fetcher';

@PositionTemplate()
export class AvalancheAbracadabraMspellContractPositionFetcher extends AbracadabraMspellContractPositionFetcher {
  groupLabel = 'mSPELL';
  mSpellAddress = '0xbd84472b31d947314fdfa2ea42460a2727f955af';
}
