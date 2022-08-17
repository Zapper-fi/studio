import { Register } from '~app-toolkit/decorators';
import { Network } from '~types';

import { ABRACADABRA_DEFINITION } from '../abracadabra.definition';
import { AbracadabraMspellContractPositionFetcher } from '../common/abracadabra.m-spell.contract-position-fetcher';

const appId = ABRACADABRA_DEFINITION.id;
const groupId = ABRACADABRA_DEFINITION.groups.mSpell.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumAbracadabraMspellContractPositionFetcher extends AbracadabraMspellContractPositionFetcher {
  appId = appId;
  groupId = groupId;
  network = network;
  mSpellAddress = '0xbd2fbaf2dc95bd78cf1cd3c5235b33d1165e6797';
}
