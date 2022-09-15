import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { VaultTokenFetcher } from '~position/template/vault.template.token-fetcher';

@PositionTemplate()
export class EthereumRedactedCartelWxBtrflyV1TokenFetcher extends VaultTokenFetcher {
  groupLabel = 'wxBTRFLY v1';

  vaultAddress = '0x186e55c0bebd2f69348d94c4a27556d93c5bd36c';
  underlyingTokenAddress = '0xcc94faf235cc5d3bf4bed3a30db5984306c86abc';
}
