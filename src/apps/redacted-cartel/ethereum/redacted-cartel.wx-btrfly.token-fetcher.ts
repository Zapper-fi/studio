import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { VaultTokenFetcher } from '~position/template/vault.template.token-fetcher';

export type RedactedCartelWxBtrflyDataProps = {
  liquidity: number;
  reserve: number;
};

@PositionTemplate()
export class EthereumRedactedCartelWxBtrflyTokenFetcher extends VaultTokenFetcher {
  groupLabel = 'wxBTRFLY';

  vaultAddress = '0x4b16d95ddf1ae4fe8227ed7b7e80cf13275e61c9';
  underlyingTokenAddress = '0xcc94faf235cc5d3bf4bed3a30db5984306c86abc';
}
