import { Register } from '~app-toolkit/decorators';
import { VaultTokenFetcher } from '~position/template/vault.template.token-fetcher';
import { Network } from '~types/network.interface';

import { REDACTED_CARTEL_DEFINITION } from '../redacted-cartel.definition';

const appId = REDACTED_CARTEL_DEFINITION.id;
const groupId = REDACTED_CARTEL_DEFINITION.groups.wxBtrfly.id;
const network = Network.ETHEREUM_MAINNET;

export type RedactedCartelWxBtrflyDataProps = {
  liquidity: number;
  reserve: number;
};

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumRedactedCartelWxBtrflyTokenFetcher extends VaultTokenFetcher {
  appId = appId;
  groupId = groupId;
  network = network;
  groupLabel = 'wxBTRFLY';

  vaultAddress = '0x4b16d95ddf1ae4fe8227ed7b7e80cf13275e61c9';
  underlyingTokenAddress = '0xcc94faf235cc5d3bf4bed3a30db5984306c86abc';
}
