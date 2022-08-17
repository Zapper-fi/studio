import { Register } from '~app-toolkit/decorators';
import { Erc20 } from '~contract/contracts';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { Network } from '~types';

import { ABRACADABRA_DEFINITION } from '../abracadabra.definition';

const appId = ABRACADABRA_DEFINITION.id;
const groupId = ABRACADABRA_DEFINITION.groups.stakedSpell.id;
const network = Network.AVALANCHE_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class AvalancheAbracadabraStakedSpellTokenFetcher extends AppTokenTemplatePositionFetcher<Erc20> {
  appId = appId;
  groupId = groupId;
  network = network;
  fromNetwork = Network.ETHEREUM_MAINNET;

  getContract(address: string) {
    return this.appToolkit.globalContracts.erc20({ address, network: this.network });
  }

  getAddresses() {
    return ['0x3ee97d514bbef95a2f110e6b9b73824719030f7a'];
  }

  async getUnderlyingTokenAddresses() {
    return ['0x26fa3fffb6efe8c1e69103acb4044c26b9a106a9'];
  }
}
