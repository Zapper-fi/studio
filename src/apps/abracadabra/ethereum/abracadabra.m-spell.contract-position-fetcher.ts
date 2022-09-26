import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { AbracadabraMspellContractPositionFetcher } from '../common/abracadabra.m-spell.contract-position-fetcher';

@PositionTemplate()
export class EthereumAbracadabraMspellContractPositionFetcher extends AbracadabraMspellContractPositionFetcher {
  groupLabel = 'mSPELL';
  mSpellAddress = '0xbd2fbaf2dc95bd78cf1cd3c5235b33d1165e6797';
}
