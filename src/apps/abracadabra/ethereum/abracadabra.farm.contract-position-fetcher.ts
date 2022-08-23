import { Register } from '~app-toolkit/decorators';
import { Network } from '~types/network.interface';

import { ABRACADABRA_DEFINITION } from '../abracadabra.definition';
import { AbracadabraFarmContractPositionFetcher } from '../common/abracadabra.farm.contract-position-fetcher';

const appId = ABRACADABRA_DEFINITION.id;
const groupId = ABRACADABRA_DEFINITION.groups.farm.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumAbracadabraFarmContractPositionFetcher extends AbracadabraFarmContractPositionFetcher {
  appId = appId;
  groupId = groupId;
  network = network;
  groupLabel = 'Farms';
  chefAddress = '0xf43480afe9863da4acbd4419a47d9cc7d25a647f';
}
