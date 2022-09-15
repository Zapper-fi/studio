import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { VaultTokenFetcher } from '~position/template/vault.template.token-fetcher';

@PositionTemplate()
export class EthereumRedactedCartelXBtrflyTokenFetcher extends VaultTokenFetcher {
  groupLabel = 'xBTRFLY';

  vaultAddress = '0xcc94faf235cc5d3bf4bed3a30db5984306c86abc';
  underlyingTokenAddress = '0xc0d4ceb216b3ba9c3701b291766fdcba977cec3a';
  reserveAddress = '0xbde4dfb0dbb0dd8833efb6c5bd0ce048c852c487';

  async getPricePerShare() {
    return 1;
  }
}
