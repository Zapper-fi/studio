import { Injectable } from '@nestjs/common';

import { VaultTemplateTokenFetcher } from '~position/template/vault.template.token-fetcher';
import { Network } from '~types/network.interface';

import { REDACTED_CARTEL_DEFINITION } from '../redacted-cartel.definition';

@Injectable()
export class EthereumRedactedCartelWxBtrflyV1TokenFetcher extends VaultTemplateTokenFetcher {
  appId = REDACTED_CARTEL_DEFINITION.id;
  groupId = REDACTED_CARTEL_DEFINITION.groups.wxBtrflyV1.id;
  network = Network.ETHEREUM_MAINNET;
  groupLabel = 'wxBTRFLY v1';

  vaultAddress = '0x186e55c0bebd2f69348d94c4a27556d93c5bd36c';
  underlyingTokenAddress = '0xcc94faf235cc5d3bf4bed3a30db5984306c86abc';
}
