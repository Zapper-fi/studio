import { Register } from '~app-toolkit/decorators';
import { VaultTokenFetcher } from '~position/template/vault.template.token-fetcher';
import { Network } from '~types/network.interface';

import { REDACTED_CARTEL_DEFINITION } from '../redacted-cartel.definition';

const appId = REDACTED_CARTEL_DEFINITION.id;
const groupId = REDACTED_CARTEL_DEFINITION.groups.wxBtrflyV1.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumRedactedCartelWxBtrflyV1TokenFetcher extends VaultTokenFetcher {
  appId = appId;
  groupId = groupId;
  network = network;
  groupLabel = 'wxBTRFLY v1';

  vaultAddress = '0x186e55c0bebd2f69348d94c4a27556d93c5bd36c';
  underlyingTokenAddress = '0xcc94faf235cc5d3bf4bed3a30db5984306c86abc';
}
