import { Register } from '~app-toolkit/decorators';
import { Network } from '~types/network.interface';

import { ABRACADABRA_DEFINITION } from '../abracadabra.definition';
import { AbracadabraCauldronContractPositionFetcher } from '../common/abracadabra.cauldron.contract-position-fetcher';

const appId = ABRACADABRA_DEFINITION.id;
const groupId = ABRACADABRA_DEFINITION.groups.cauldron.id;
const network = Network.ARBITRUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class ArbitrumAbracadabraCauldronContractPositionFetcher extends AbracadabraCauldronContractPositionFetcher {
  appId = appId;
  groupId = groupId;
  network = network;
  cauldrons = [
    '0xc89958b03a55b5de2221acb25b58b89a000215e6', // ETH
  ];
}
