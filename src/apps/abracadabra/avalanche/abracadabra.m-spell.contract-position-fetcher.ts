import { Register } from '~app-toolkit/decorators';
import { Network } from '~types';

import { ABRACADABRA_DEFINITION } from '../abracadabra.definition';
import { AbracadabraMspellContractPositionFetcher } from '../common/abracadabra.m-spell.contract-position-fetcher';

const appId = ABRACADABRA_DEFINITION.id;
const groupId = ABRACADABRA_DEFINITION.groups.mSpell.id;
const network = Network.AVALANCHE_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class AvalancheAbracadabraMspellContractPositionFetcher extends AbracadabraMspellContractPositionFetcher {
  appId = appId;
  groupId = groupId;
  network = network;
  mSpellAddress = '0xbd84472b31d947314fdfa2ea42460a2727f955af';
}
