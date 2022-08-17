import { Register } from '~app-toolkit/decorators';
import { Erc20 } from '~contract/contracts';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { Network } from '~types';

import { ABRACADABRA_DEFINITION } from '../abracadabra.definition';

const appId = ABRACADABRA_DEFINITION.id;
const groupId = ABRACADABRA_DEFINITION.groups.stakedSpell.id;
const network = Network.ARBITRUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class ArbitrumAbracadabraStakedSpellAppTokenFetcher extends AppTokenTemplatePositionFetcher<Erc20> {
  appId = appId;
  groupId = groupId;
  network = network;
  fromNetwork = Network.ETHEREUM_MAINNET;

  getContract(address: string) {
    return this.appToolkit.globalContracts.erc20({ address, network: this.network });
  }

  getAddresses() {
    return ['0xf7428ffcb2581a2804998efbb036a43255c8a8d3'];
  }

  async getUnderlyingTokenAddresses() {
    return ['0x26fa3fffb6efe8c1e69103acb4044c26b9a106a9'];
  }
}
