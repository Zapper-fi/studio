import { Register } from '~app-toolkit/decorators';
import { Network } from '~types/network.interface';

import { ABRACADABRA_DEFINITION } from '../abracadabra.definition';
import { AbracadabraFarmContractPositionFetcher } from '../common/abracadabra.farm.contract-position-fetcher';

const appId = ABRACADABRA_DEFINITION.id;
const groupId = ABRACADABRA_DEFINITION.groups.farm.id;
const network = Network.FANTOM_OPERA_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class FantomAbracadabraFarmContractPositionFetcher extends AbracadabraFarmContractPositionFetcher {
  appId = appId;
  groupId = groupId;
  network = network;
  chefAddress = '0x37cf490255082ee50845ea4ff783eb9b6d1622ce';
}
