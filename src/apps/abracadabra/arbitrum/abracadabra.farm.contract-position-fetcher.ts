import { Register } from '~app-toolkit/decorators';
import { Network } from '~types/network.interface';

import { ABRACADABRA_DEFINITION } from '../abracadabra.definition';
import { AbracadabraFarmContractPositionFetcher } from '../common/abracadabra.farm.contract-position-fetcher';

const appId = ABRACADABRA_DEFINITION.id;
const groupId = ABRACADABRA_DEFINITION.groups.farm.id;
const network = Network.ARBITRUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class ArbitrumAbracadabraFarmContractPositionFetcher extends AbracadabraFarmContractPositionFetcher {
  appId = appId;
  groupId = groupId;
  network = network;
  chefAddress = '0x839de324a1ab773f76a53900d70ac1b913d2b387';
}
