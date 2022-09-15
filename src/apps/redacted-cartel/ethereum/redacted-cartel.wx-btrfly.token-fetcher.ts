import { Injectable } from '@nestjs/common';

import { VaultTemplateTokenFetcher } from '~position/template/vault.template.token-fetcher';
import { Network } from '~types/network.interface';

import { REDACTED_CARTEL_DEFINITION } from '../redacted-cartel.definition';

export type RedactedCartelWxBtrflyDataProps = {
  liquidity: number;
  reserve: number;
};

@Injectable()
export class EthereumRedactedCartelWxBtrflyTokenFetcher extends VaultTemplateTokenFetcher {
  appId = REDACTED_CARTEL_DEFINITION.id;
  groupId = REDACTED_CARTEL_DEFINITION.groups.wxBtrfly.id;
  network = Network.ETHEREUM_MAINNET;
  groupLabel = 'wxBTRFLY';

  vaultAddress = '0x4b16d95ddf1ae4fe8227ed7b7e80cf13275e61c9';
  underlyingTokenAddress = '0xcc94faf235cc5d3bf4bed3a30db5984306c86abc';
}
