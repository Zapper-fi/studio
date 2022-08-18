import { Register } from '~app-toolkit/decorators';
import { Network } from '~types';

import { ABRACADABRA_DEFINITION } from '../abracadabra.definition';
import { AbracadabraMspellContractPositionFetcher } from '../common/abracadabra.m-spell.contract-position-fetcher';

const appId = ABRACADABRA_DEFINITION.id;
const groupId = ABRACADABRA_DEFINITION.groups.mSpell.id;
const network = Network.FANTOM_OPERA_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class FantomAbracadabraMspellContractPositionFetcher extends AbracadabraMspellContractPositionFetcher {
  appId = appId;
  groupId = groupId;
  network = network;
  mSpellAddress = '0xa668762fb20bcd7148db1bdb402ec06eb6dad569';
}
