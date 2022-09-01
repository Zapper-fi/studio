import { Register } from '~app-toolkit/decorators';
import { Network } from '~types';

import { ABRACADABRA_DEFINITION } from '../abracadabra.definition';
import { AbracadabraMspellContractPositionFetcher } from '../common/abracadabra.m-spell.contract-position-fetcher';

const appId = ABRACADABRA_DEFINITION.id;
const groupId = ABRACADABRA_DEFINITION.groups.mSpell.id;
const network = Network.ARBITRUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class ArbitrumAbracadabraMspellContractPositionFetcher extends AbracadabraMspellContractPositionFetcher {
  appId = appId;
  groupId = groupId;
  network = network;
  groupLabel = 'mSPELL';
  mSpellAddress = '0x1df188958a8674b5177f77667b8d173c3cdd9e51';
}
