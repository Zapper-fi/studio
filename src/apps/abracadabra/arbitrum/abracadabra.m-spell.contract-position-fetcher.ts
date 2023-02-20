import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { AbracadabraMspellContractPositionFetcher } from '../common/abracadabra.m-spell.contract-position-fetcher';

import { M_SPELL_ADDRESS } from './abracadabra.arbitrum.constants';

@PositionTemplate()
export class ArbitrumAbracadabraMspellContractPositionFetcher extends AbracadabraMspellContractPositionFetcher {
  groupLabel = 'mSPELL';
  mSpellAddress = M_SPELL_ADDRESS;
}
